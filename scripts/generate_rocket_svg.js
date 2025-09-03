import fs from "fs";

const USERNAME = "imshravan26";
const OUT_PATH = "assets/rocket.svg";

async function fetchContributions(username) {
  // Mock contribution data for demonstration
  // In a real implementation, you would fetch this from GitHub API
  const contributions = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 12);

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    contributions.push({
      date: d.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10),
    });
  }

  return contributions;
}

function buildSVG(days) {
  const width = 800;
  const height = 200;
  const cols = 53; // weeks in a year
  const rows = 7; // days in a week
  const cellSize = 10;
  const cellGap = 2;
  const offsetX = 50;
  const offsetY = 50;

  // Build contribution squares
  let rects = "";
  days.forEach((day, index) => {
    const col = Math.floor(index / rows);
    const row = index % rows;
    const x = offsetX + col * (cellSize + cellGap);
    const y = offsetY + row * (cellSize + cellGap);
    const opacity = Math.min(1, day.count / 10);
    const color = day.count > 0 ? `rgba(34, 197, 94, ${opacity})` : "#1f2937";

    rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"/>`;
  });

  // Create flight path
  const pathPoints = [
    [50, height - 50],
    [width / 4, 80],
    [width / 2, height - 30],
    [(3 * width) / 4, 60],
    [width - 50, height - 40],
  ];

  let path = `M ${pathPoints[0][0]} ${pathPoints[0][1]}`;
  for (let i = 1; i < pathPoints.length; i++) {
    const cp1x =
      pathPoints[i - 1][0] + (pathPoints[i][0] - pathPoints[i - 1][0]) / 3;
    const cp1y = pathPoints[i - 1][1];
    const cp2x =
      pathPoints[i][0] - (pathPoints[i][0] - pathPoints[i - 1][0]) / 3;
    const cp2y = pathPoints[i][1];
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pathPoints[i][0]} ${pathPoints[i][1]}`;
  }

  // Rocket SVG
  const rocket = `
  <g id="rocket">
    <g transform="translate(-12, -12)">
      <polygon points="12,0 16,8 12,6 8,8" fill="#EF4444"/>
      <rect x="10" y="6" width="4" height="10" fill="#F3F4F6"/>
      <polygon points="8,16 10,20 12,16 14,20 16,16 14,16 10,16" fill="#F59E0B">
        <animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" />
      </polygon>
    </g>
  </g>
  `;

  // Animate the rocket along path
  const motion = `
  <path id="fly" d="${path}" fill="none" stroke="none"/>
  <g>
    ${rocket}
    <animateMotion dur="12s" repeatCount="indefinite" rotate="auto">
      <mpath href="#fly" />
    </animateMotion>
  </g>
  `;

  const title = `<text x="${
    width / 2
  }" y="22" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui" font-size="14" fill="#374151">${new Date().toLocaleDateString(
    "en-IN",
    { year: "numeric", month: "short", day: "2-digit" }
  )} • Rocket over my contributions</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rocket over contributions">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#0B1220"/>
  <g filter="url(#shadow)">
    ${title}
    ${rects}
    ${motion}
  </g>
</svg>`;
}

async function main() {
  try {
    const days = await fetchContributions(USERNAME);
    const svg = buildSVG(days);
    fs.mkdirSync("assets", { recursive: true });
    fs.writeFileSync(OUT_PATH, svg, "utf8");
    console.log(`Wrote ${OUT_PATH} with ${days.length} days.`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

await main();
