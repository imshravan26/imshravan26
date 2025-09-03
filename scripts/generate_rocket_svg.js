const fs = require("fs");

const width = 800;
const height = 200;

// Generate stars at random positions
function generateStars(count) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 1.5 + 0.5;
    stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="white" />`;
  }
  return stars;
}

const stars = generateStars(80);

const rocketSvg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="black" />
  ${stars}

  <!-- Planet -->
  <circle cx="700" cy="100" r="40" fill="url(#planetGradient)" />
  <defs>
    <radialGradient id="planetGradient">
      <stop offset="0%" stop-color="orange" />
      <stop offset="100%" stop-color="red" />
    </radialGradient>
  </defs>

  <!-- Rocket -->
  <g>
    <rect x="50" y="80" width="30" height="40" fill="silver" stroke="white" />
    <polygon points="50,80 65,50 80,80" fill="white" />
    <polygon points="50,120 40,135 50,135" fill="red" />
    <polygon points="80,120 90,135 80,135" fill="red" />

    <!-- Fire -->
    <polygon points="65,120 60,150 70,150" fill="orange">
      <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="0.3s" repeatCount="indefinite" />
    </polygon>
  </g>

  <!-- Animation moving rocket -->
  <g>
    <rect x="50" y="80" width="30" height="40" fill="none" />
    <animateTransform attributeName="transform" type="translate" from="0 0" to="600 0" dur="10s" repeatCount="indefinite" />
  </g>
</svg>`;

fs.writeFileSync("assets/rocket.svg", rocketSvg);
