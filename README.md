# RED DUST LAB — RDL-001 website v3

A responsive, static research website for an Earth-based dust-analogue / photovoltaic voltage experiment. Built for GitHub Pages; no build system or server-side dependencies are required.

## Files
- `index.html` — project overview, experiment, recipe, results, Mars context, evidence gallery, creator profile and references.
- `simulation.html` — separate Simulation Lab page with discrete observation replay, slider, direct jumps and autoplay.
- `styles.css` — shared responsive styling and animations.
- `script.js` — homepage animations, result chart, CSV download, mobile navigation and evidence-photo lightbox.
- `simulation.js` — recorded-observation replay and conceptual coverage explorer.
- `assets/` — 16 individual experiment-photo crops plus the creator portrait.

## Run locally
Open `index.html` in a modern browser. The Simulation Lab is linked from the top navigation and opens `simulation.html`. For local development, VS Code Live Server can serve the folder.

## Publish to GitHub Pages
1. Back up the existing repository or create a branch.
2. Upload the contents of this folder, preserving the `assets/` directory and both HTML pages.
3. Keep `index.html`, `simulation.html`, `styles.css`, `script.js` and `simulation.js` in the same published root folder.
4. Commit and allow GitHub Pages to redeploy.

## Data integrity notes
- The replay uses four sequential observations: 2:50 p.m.; an intermediate observation with unverified time; 3:03 p.m.; and 3:06 p.m.
- The second observation is shown in sequence but without a fabricated timestamp. Values are not interpolated between stops.
- Latest user clarification: at 3:06 p.m. Rover 01 = 0 V / no measurable output; Rover 02 ≈ 3.5 V; Main solar panel = 0 V / no measurable output. These are reported outcomes, not precision 0.000 V readings.
- At 3:03 p.m., Rover 01 = 8.9 V; Rover 02 = 4.5 V; Main panel = 0 V / no measurable output.
- The second observation is Rover 01 = 9.0 V; Rover 02 = 4.6 V; Main panel = very small, unquantified output.
- The 500 g analogue recipe is scaled from the supplied 250 g masses. For MgO, 19.50 g / 250 g = 7.8%, not the 8.9% typed in the message. The listed original percentages sum to 101.1%; percentages derived from the recorded masses sum to 100%. The site preserves masses and flags this discrepancy for verification.
- 10 g was introduced during a reported 15-minute feed interval (0.667 g/min). This does not establish airborne concentration or panel-deposited mass.
- Voltage only is reported; current, power, energy and efficiency are not calculated.
- The 0.01% Mars dust mass fraction is labelled as a simplifying assumption, not an established Mars constant.
- Meridiani Planum is used as a NASA Opportunity case study; the project is not a direct Mars simulation and is not NASA-endorsed.

## Evidence and privacy
- `assets/experiment-01.jpg` through `experiment-08.jpg` and `assets/field-01.jpg` through `field-08.jpg` are individual crops from the two collages supplied for this update.
- `assets/sinuri-portrait.jpg` is a crop of the creator photograph supplied for the profile. Review the public profile and personal details before publishing to a public website.
- No experiment video file was supplied. Add a public video link only after uploading the original video and testing its access permissions.

## Accessibility and compatibility
- Responsive desktop and mobile layouts.
- Keyboard-accessible replay controls and image lightbox.
- Honors reduced-motion preferences.
- Uses standard HTML, CSS, JavaScript and SVG; no npm packages or backend.
