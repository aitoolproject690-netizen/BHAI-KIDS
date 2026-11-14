# BHAI Kids

A small, phone-first cartoon-learning PWA. The first playable sample is **Jungle ke pyaare dost**, a Hindi animated story introducing an elephant, monkey, parrot and lion.

## Product rules

- The child opens the app and taps the cartoon they like. No child account, age form, subject picker, chat, comments, ads or trackers.
- No backend, paid API, VPS, analytics SDK, external fonts or runtime framework dependency.
- The first episode is drawn by the app's lightweight SVG/CSS animation engine. It is not a rendered MP4 file.
- Narration uses the phone/browser's built-in Speech Synthesis when a Hindi voice is available. This is device/browser functionality, not an API key or a guaranteed bundled voice. Captions always show the story.
- The service worker caches the app shell after the first successful visit. The app UI and vector episode can then open offline. Device speech may depend on whether a Hindi voice is installed and available offline.
- Completion state is stored locally on the device only.

## Run locally

Open \`site/index.html\` from a local static web server. Service workers require localhost or HTTPS; opening the file directly still allows the basic page to render, but offline installation will not be available.

No package installation or build step is required.

## GitHub Pages

The workflow at \`.github/workflows/pages.yml\` runs dependency-free smoke tests and deploys the \`site/\` directory to GitHub Pages after the checks pass. The Pages URL should be:

\`https://aitoolproject690-netizen.github.io/BHAI-KIDS/\`

The first workflow run may need GitHub Pages to be enabled for the repository with **Build and deployment → Source: GitHub Actions** in repository Settings. Once configured, pushes to \`main\` run checks and deploy automatically.

## Current MVP scope

- One complete, six-scene Hindi cartoon episode.
- Animated vector characters, captions, pause/resume, previous/next, replay and optional device narration.
- Responsive home screen and cartoon player.
- Installable PWA manifest and offline app-shell cache.
- Basic local completion marker.

## Honest limitations

A free static site is suitable for this starter and a small set of lightweight vector episodes. It is not an unlimited video CDN. Hosting large MP4 libraries or serving very high traffic may exceed free hosting limits. Do not upload copyrighted cartoons; future episodes must be original or properly licensed.