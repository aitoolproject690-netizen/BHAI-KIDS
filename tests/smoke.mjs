import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const app = readFileSync("site/assets/app.js", "utf8");
const css = readFileSync("site/assets/app.css", "utf8");
const manifest = JSON.parse(readFileSync("site/manifest.webmanifest", "utf8"));
const worker = readFileSync("site/sw.js", "utf8");
const cartoon = readFileSync("site/assets/cartoon-v2.js", "utf8");
const cartoonCss = readFileSync("site/assets/cartoon-v2.css", "utf8");

assert.match(html, /id="bhai-kids-v2"/, "Cartoon-first app root must exist");
assert.match(html, /cartoon-v2.js/, "New cartoon experience must load");
assert.match(cartoon, /jungle adventure/i, "Original story engine must be present");
assert.match(cartoon, /SpeechSynthesisUtterance/, "Hindi device narration must be present");
assert.match(cartoon, /AudioContext/, "Local sound generation must be present");
assert.match(cartoonCss, /v2-jump/, "Cartoon actions must animate");
assert.match(cartoonCss, /prefers-reduced-motion/, "Reduced motion must be respected");
assert.match(html, /id="home-screen"/, "Fallback home screen must exist");
assert.match(html, /id="player-screen"/, "Cartoon player must exist");
assert.match(html, /id="caption-text"/, "Captions must be available");
assert.match(app, /jungle-dost/, "First cartoon episode must be registered");
assert.match(app, /speechSynthesis/, "Device speech support must be handled");
assert.match(app, /localStorage/, "Local-only progress storage must be available");
assert.match(css, /prefers-reduced-motion/, "Reduced motion preference must be respected");
assert.match(worker, /addAll\(APP_FILES\)/, "App shell must be cached for offline use");
assert.match(worker, /cartoon-v2.js/, "New story assets must be cached offline");
assert.equal(manifest.name, "BHAI Kids - Cartoon se seekho");
assert.equal(manifest.display, "standalone");
assert.ok(existsSync("site/icon.svg"), "PWA icon must exist");

console.log("BHAI Kids smoke tests passed.");
