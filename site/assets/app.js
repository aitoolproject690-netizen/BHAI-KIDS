const episodes = [{
  id: "jungle-dost",
  duration: 60,
  scenes: [
    { title: "Chalo jungle chalein!", text: "Namaste bachcho! Aaj hum jungle ke pyaare doston se milenge. Chalo, sabko hello bolte hain!", animals: [{ kind: "monkey", x: 650, y: 230, s: 1.05 }, { kind: "parrot", x: 330, y: 170, s: 0.95 }] },
    { title: "Yeh hai haathi", text: "Yeh hai haathi. Haathi bahut bada hota hai. Iski lambi soond hoti hai. Haathi apni soond se paani bhi peeta hai!", animals: [{ kind: "elephant", x: 470, y: 175, s: 1.35 }] },
    { title: "Yeh hai bandar", text: "Yeh hai bandar. Bandar ped par chadh sakta hai. Ise kele khana bahut pasand hai. Hello bandar!", animals: [{ kind: "monkey", x: 480, y: 205, s: 1.35 }] },
    { title: "Yeh hai tota", text: "Yeh hai hara tota. Tota apni chonch se dana khata hai. Tota meethi awaaz mein bolta hai: Mitthu, Mitthu!", animals: [{ kind: "parrot", x: 475, y: 165, s: 1.45 }] },
    { title: "Yeh hai sher", text: "Yeh hai sher. Sher ke sir par ghane baal hote hain. Sher ko jungle ka raja kehte hain. Wah, kitna sundar sher!", animals: [{ kind: "lion", x: 475, y: 180, s: 1.35 }] },
    { title: "Kitne saare dost!", text: "Aaj humne haathi, bandar, tota aur sher ko jaana. Chaar pyaare dost! Shabash bachcho, phir milenge!", animals: [{ kind: "elephant", x: 220, y: 260, s: 0.78 }, { kind: "monkey", x: 405, y: 265, s: 0.78 }, { kind: "parrot", x: 575, y: 235, s: 0.78 }, { kind: "lion", x: 755, y: 255, s: 0.78 }] }
  ]
}];

const homeScreen = document.getElementById("home-screen");
const playerScreen = document.getElementById("player-screen");
const startButton = document.getElementById("start-episode");
const sceneArt = document.getElementById("scene-art");
const captionText = document.getElementById("caption-text");
const sceneCounter = document.getElementById("scene-counter");
const progressFill = document.getElementById("progress-fill");
const playPauseButton = document.getElementById("play-pause");
const voiceToggle = document.getElementById("voice-toggle");
const voiceIcon = document.getElementById("voice-icon");
const voiceLabel = document.getElementById("voice-label");
const voiceHint = document.getElementById("voice-hint");
const completionPanel = document.getElementById("completion-panel");

const SCENE_MS = 9500;
let currentScene = 0;
let playing = false;
let voiceEnabled = true;
let sceneTimer = null;
let utterance = null;
let completed = readCompleted();

function readCompleted() {
  try { return JSON.parse(localStorage.getItem("bhai-kids-progress-v1") || "[]"); }
  catch (_) { return []; }
}

function saveCompleted() {
  try { localStorage.setItem("bhai-kids-progress-v1", JSON.stringify(completed)); }
  catch (_) { /* Private browsing may block storage; playback still works. */ }
}

function animal(kind, x, y, scale, delay) {
  const start = '<g class="animal-float delay-' + delay + '" transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">';
  const eye = '<ellipse cx="0" cy="0" rx="4.5" ry="6" fill="#26364b"/><circle cx="1.2" cy="-2" r="1.7" fill="#fff"/>';
  let body = "";
  if (kind === "elephant") {
    body = '<ellipse cx="0" cy="68" rx="77" ry="58" fill="#91a7b0"/><path d="M-50 98v38q0 10 10 10h9q10 0 10-10v-31M22 98v38q0 10 10 10h9q10 0 10-10v-33" fill="#8199a3"/><ellipse cx="-69" cy="11" rx="35" ry="54" fill="#b4c4c9" stroke="#8199a3" stroke-width="7" transform="rotate(-23 -69 11)"/><ellipse cx="-4" cy="0" rx="57" ry="56" fill="#a7b9bf"/><path d="M39 4q36 36 22 76q-6 18-24 7" fill="none" stroke="#91a7b0" stroke-width="24" stroke-linecap="round" class="trunk-sway"/><ellipse cx="40" cy="43" rx="14" ry="10" fill="#d98e91" opacity=".65"/><g transform="translate(30 -9)">' + eye + '</g><path d="M-5 38q12 11 25 0" fill="none" stroke="#536e79" stroke-width="4" stroke-linecap="round"/><circle cx="-45" cy="40" r="8" fill="#ec9e9e" opacity=".7"/>';
  } else if (kind === "monkey") {
    body = '<path d="M43 65q70 8 64 70q-3 46-54 27q-28-10-18-34q10-20 29-5q12 11 0 20" fill="none" stroke="#9a6548" stroke-width="15" stroke-linecap="round" class="tail-sway"/><ellipse cx="0" cy="78" rx="43" ry="59" fill="#a96f4d"/><path d="M-19 110l-20 36M21 110l24 36" stroke="#815239" stroke-width="15" stroke-linecap="round"/><circle cx="-50" cy="-3" r="22" fill="#a96f4d"/><circle cx="50" cy="-3" r="22" fill="#a96f4d"/><ellipse cx="0" cy="6" rx="61" ry="62" fill="#a96f4d"/><ellipse cx="0" cy="23" rx="42" ry="34" fill="#f2d1a9"/><g transform="translate(-21 0)">' + eye + '</g><g transform="translate(21 0)">' + eye + '</g><ellipse cx="0" cy="42" rx="8" ry="5" fill="#704c3f"/><path d="M-12 52q12 12 24 0" fill="none" stroke="#704c3f" stroke-width="3" stroke-linecap="round"/><circle cx="-43" cy="31" r="9" fill="#e79b91" opacity=".7"/><circle cx="43" cy="31" r="9" fill="#e79b91" opacity=".7"/><path d="M-43 55q-18 35-7 50M43 55q20 28 10 49" fill="none" stroke="#a96f4d" stroke-width="13" stroke-linecap="round"/><path d="M-2 45q3 4 6 0" stroke="#cf7372" stroke-width="5" stroke-linecap="round" class="talk-mouth"/>';
  } else if (kind === "parrot") {
    body = '<path d="M-8 38q-38 35-44 91q37-17 62-61" fill="#3d9b73"/><path d="M14 22q52 12 36 69q-9 42-58 53q-35-14-30-70q2-44 52-52" fill="#55b978"/><path d="M-13 43q-29 31-19 68q25-14 42-48" fill="#8bd275" class="wing-flap"/><circle cx="-1" cy="-17" r="50" fill="#54b979"/><ellipse cx="-7" cy="1" rx="30" ry="24" fill="#d8edb6"/><path d="M36-3q43 5 37 27q-8 23-35 13q13-16-2-40" fill="#ef9b46"/><path d="M37 12q21 11 36 4q-9 27-34 21" fill="#d86c43"/><g transform="translate(-18 -27)">' + eye + '</g><path d="M-10 124l-8 18m35-19l6 19" stroke="#d89244" stroke-width="5" stroke-linecap="round"/>';
  } else if (kind === "lion") {
    body = '<ellipse cx="0" cy="70" rx="74" ry="57" fill="#d99852"/><path d="M-48 100l-7 34q-2 12 10 12h10q10 0 12-10l8-33M24 101l8 34q3 12 14 9l8-2q10-3 7-14l-12-36" fill="#bd7d45"/><circle cx="0" cy="0" r="76" fill="#bd793f"/><circle cx="0" cy="0" r="59" fill="#e9b35f"/><circle cx="-39" cy="-44" r="20" fill="#bd793f"/><circle cx="39" cy="-44" r="20" fill="#bd793f"/><circle cx="-39" cy="-44" r="10" fill="#efc58a"/><circle cx="39" cy="-44" r="10" fill="#efc58a"/><g transform="translate(-21 -8)">' + eye + '</g><g transform="translate(21 -8)">' + eye + '</g><ellipse cx="0" cy="26" rx="27" ry="21" fill="#f6d9a4"/><path d="M-9 19q9-8 18 0q-9 12-18 0" fill="#65483d"/><path d="M0 30q-2 15-14 14m14-14q2 15 14 14" fill="none" stroke="#80533d" stroke-width="3" stroke-linecap="round"/><circle cx="-45" cy="23" r="8" fill="#e99c8a" opacity=".65"/><circle cx="45" cy="23" r="8" fill="#e99c8a" opacity=".65"/>';
  }
  const mouth = '<ellipse cx="0" cy="0" rx="7" ry="4" fill="#744a46" class="talk-mouth"/>';
  return start + body + '<ellipse cx="0" cy="151" rx="55" ry="8" fill="#477e62" opacity=".18"/><g transform="translate(0 0)">' + mouth + '</g></g>';
}

function sceneSvg(scene) {
  const trees = '<g opacity=".98"><path d="M100 350v-178q0-10 10-10t10 10v178" fill="#9a7151"/><circle cx="110" cy="155" r="75" fill="#4d9b70"/><circle cx="65" cy="192" r="44" fill="#61b77a"/><circle cx="148" cy="194" r="48" fill="#3d8c69"/><path d="M840 360V175q0-10 10-10t10 10v185" fill="#9a7151"/><circle cx="850" cy="153" r="78" fill="#4a9a6f"/><circle cx="800" cy="194" r="48" fill="#62b77b"/><circle cx="895" cy="198" r="45" fill="#398863"/></g>';
  const clouds = '<g fill="#fff9ed" opacity=".8"><ellipse cx="220" cy="91" rx="57" ry="18"/><circle cx="194" cy="80" r="22"/><circle cx="225" cy="72" r="29"/><circle cx="252" cy="84" r="20"/><ellipse cx="680" cy="111" rx="50" ry="15"/><circle cx="660" cy="100" r="20"/><circle cx="686" cy="91" r="25"/><circle cx="713" cy="103" r="17"/></g>';
  const animals = scene.animals.map(function(a, i) { return animal(a.kind, a.x, a.y, a.s, i); }).join("");
  return '<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + escapeHtml(scene.title) + '">' +
    '<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#8dd3ee"/><stop offset="1" stop-color="#d7f3dc"/></linearGradient></defs>' +
    '<rect width="960" height="540" fill="url(#sky)"/><circle cx="790" cy="78" r="43" fill="#ffe68c"/>' + clouds +
    '<path d="M0 357Q170 274 340 358T680 350T960 335V540H0Z" fill="#99d58f"/><path d="M0 410Q185 330 370 425T760 405T960 392V540H0Z" fill="#68b982"/>' +
    trees + '<path d="M0 479q210-35 430 4t530-5v62H0Z" fill="#54a878"/>' +
    '<g fill="#f8e8a5"><circle cx="275" cy="438" r="5"/><circle cx="292" cy="448" r="4"/><circle cx="698" cy="450" r="5"/><circle cx="720" cy="432" r="4"/></g>' +
    animals + '</svg>';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function(character) {
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character];
  });
}

function speak(text) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 0.88;
  utterance.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(function(voice) { return /^hi(-|_)/i.test(voice.lang); });
  if (hindiVoice) utterance.voice = hindiVoice;
  window.speechSynthesis.speak(utterance);
}

function stopVoice() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  utterance = null;
}

function updateVoiceUi() {
  voiceToggle.setAttribute("aria-pressed", String(voiceEnabled));
  voiceIcon.textContent = voiceEnabled ? "🔊" : "🔇";
  voiceLabel.textContent = voiceEnabled ? "Awaaz on" : "Awaaz off";
  if (!("speechSynthesis" in window)) {
    voiceHint.textContent = "Is browser mein device voice nahi mili. Kahani ke captions hamesha dikhte rahenge.";
  } else if (voiceEnabled) {
    voiceHint.textContent = "Awaaz aapke phone ki Hindi voice se chalegi. Captions hamesha rahenge.";
  } else {
    voiceHint.textContent = "Awaaz band hai. Kahani captions mein chalti rahegi.";
  }
}

function renderScene() {
  const scene = episodes[0].scenes[currentScene];
  sceneArt.innerHTML = sceneSvg(scene);
  sceneArt.setAttribute("aria-label", scene.title);
  captionText.textContent = scene.text;
  sceneCounter.textContent = (currentScene + 1) + " / " + episodes[0].scenes.length;
  progressFill.style.width = ((currentScene + 1) / episodes[0].scenes.length * 100) + "%";
}

function clearSceneTimer() {
  if (sceneTimer) window.clearTimeout(sceneTimer);
  sceneTimer = null;
}

function finishEpisode() {
  clearSceneTimer();
  playing = false;
  stopVoice();
  playPauseButton.textContent = "↻";
  playPauseButton.setAttribute("aria-label", "Phir se dekho");
  completionPanel.classList.remove("hidden");
  if (!completed.includes(episodes[0].id)) {
    completed.push(episodes[0].id);
    saveCompleted();
  }
}

function advanceScene() {
  if (currentScene >= episodes[0].scenes.length - 1) {
    finishEpisode();
    return;
  }
  currentScene += 1;
  renderScene();
  speak(episodes[0].scenes[currentScene].text);
  if (playing) sceneTimer = window.setTimeout(advanceScene, SCENE_MS);
}

function startPlayback(fromBeginning) {
  clearSceneTimer();
  completionPanel.classList.add("hidden");
  if (fromBeginning) currentScene = 0;
  renderScene();
  playing = true;
  playPauseButton.textContent = "Ⅱ";
  playPauseButton.setAttribute("aria-label", "Roko");
  speak(episodes[0].scenes[currentScene].text);
  sceneTimer = window.setTimeout(advanceScene, SCENE_MS);
}

function pausePlayback() {
  clearSceneTimer();
  playing = false;
  stopVoice();
  playPauseButton.textContent = "▶";
  playPauseButton.setAttribute("aria-label", "Chalao");
}

function openPlayer() {
  homeScreen.classList.add("hidden");
  playerScreen.classList.remove("hidden");
  completionPanel.classList.add("hidden");
  currentScene = 0;
  startPlayback(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openHome() {
  pausePlayback();
  stopVoice();
  playerScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

startButton.addEventListener("click", openPlayer);
document.getElementById("back-home").addEventListener("click", openHome);
document.getElementById("replay-episode").addEventListener("click", function() { startPlayback(true); });
document.getElementById("watch-again").addEventListener("click", function() { startPlayback(true); });
document.getElementById("previous-scene").addEventListener("click", function() {
  if (currentScene > 0) {
    currentScene -= 1;
    startPlayback(false);
  } else {
    startPlayback(true);
  }
});
document.getElementById("next-scene").addEventListener("click", function() {
  if (currentScene < episodes[0].scenes.length - 1) {
    currentScene += 1;
    startPlayback(false);
  } else {
    finishEpisode();
  }
});
playPauseButton.addEventListener("click", function() {
  if (playing) pausePlayback();
  else if (completionPanel.classList.contains("hidden")) {
    playing = true;
    playPauseButton.textContent = "Ⅱ";
    playPauseButton.setAttribute("aria-label", "Roko");
    speak(episodes[0].scenes[currentScene].text);
    sceneTimer = window.setTimeout(advanceScene, SCENE_MS);
  } else {
    startPlayback(true);
  }
});
voiceToggle.addEventListener("click", function() {
  voiceEnabled = !voiceEnabled;
  if (!voiceEnabled) stopVoice();
  else if (playing) speak(episodes[0].scenes[currentScene].text);
  updateVoiceUi();
});
document.addEventListener("keydown", function(event) {
  if (playerScreen.classList.contains("hidden")) return;
  if (event.target && ["BUTTON", "INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.code === "Space") {
    event.preventDefault();
    playPauseButton.click();
  } else if (event.code === "ArrowRight") {
    document.getElementById("next-scene").click();
  } else if (event.code === "ArrowLeft") {
    document.getElementById("previous-scene").click();
  }
});

updateVoiceUi();
renderScene();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("./sw.js").catch(function() {
      voiceHint.textContent = "Offline mode is not ready yet. Internet par kahani phir bhi chalti rahegi.";
    });
  });
}