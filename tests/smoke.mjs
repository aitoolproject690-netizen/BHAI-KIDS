import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const app = readFileSync("site/assets/app.js", "utf8");
const css = readFileSync("site/assets/app.css", "utf8");
const manifest = JSON.parse(readFileSync("site/manifest.webmanifest", "utf8"));
const worker = readFileSync("site/sw.js", "utf8");

assert.match(html, /id="home-screen"/, "Home screen must exist");
assert.match(html, /id="player-screen"/, "Cartoon player must exist");
assert.match(html, /id="caption-text"/, "Captions must be available");
assert.match(app, /jungle-dost/, "First cartoon episode must be registered");
assert.match(app, /speechSynthesis/, "Device speech support must be handled");
assert.match(app, /localStorage/, "Local-only progress storage must be available");
assert.match(css, /prefers-reduced-motion/, "Reduced motion preference must be respected");
assert.match(worker, /addAll\(APP_FILES\)/, "App shell must be cached for offline use");
assert.equal(manifest.name, "BHAI Kids - Cartoon se seekho");
assert.equal(manifest.display, "standalone");
assert.ok(existsSync("site/icon.svg"), "PWA icon must exist");

console.log("BHAI Kids smoke tests passed.");
