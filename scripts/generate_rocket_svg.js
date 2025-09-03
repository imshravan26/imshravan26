import fs from "fs";

const USERNAME = process.env.GH_LOGIN || "imshravan26";
const OUT_PATH = "assets/rocket.svg";

async function fetchContributions(login) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount color } }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query, variables: { login } }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GraphQL failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  const weeks =
    json.data.user.contributionsCollection.contributionCalendar.weeks;
  return weeks.map((w) => w.contributionDays).flat();
}

function buildSVG(days) {
  // Layout constants
  const cell = 12; // size of each day cell
  const gap = 3; // gap between cells
  const weeks = Math.ceil(days.length / 7);
  const cols = weeks;
  const rows = 7;
  const width = cols * (cell + gap) + gap;
  const height = rows * (cell + gap) + gap + 40; // extra for title

  // Build grid rects (7 rows x N columns)
  let rects = "";
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const idx = c * rows + r;
      if (idx >= days.length) continue;
      const d = days[idx];
      const x = gap + c * (cell + gap);
      const y = gap + r * (cell + gap) + 30; // push down under title
      const radius = 3;
      const color = d.contributionCount > 0 ? d.color : "#e5e7eb"; // light gray fallback
      rects += `<rect x="${x}" y="${y}" rx="${radius}" ry="${radius}" width="${cell}" height="${cell}" fill="${color}"/>\n`;
    }
  }

  // Build a smooth path across the grid (rocket flies left->right with gentle wave)
  const pathY = height / 2;
  const path = `M 10 ${pathY} C ${width * 0.25} ${pathY - 40}, ${
    width * 0.75
  } ${pathY + 40}, ${width - 10} ${pathY}`;

  // Simple rocket SVG (emoji-like)
  const rocket = `
    <g id="rocket" transform="scale(0.8)">
      <g>
        <ellipse cx="0" cy="0" rx="10" ry="6" fill="#9CA3AF"/>
        <polygon points="10,0 20,4 20,-4" fill="#F87171"/>
        <polygon points="-8,0 -16,6 -8,4" fill="#60A5FA"/>
        <polygon points="-8,0 -16,-6 -8,-4" fill="#60A5FA"/>
        <circle cx="-2" cy="0" r="2.2" fill="#111827"/>
        <circle cx="-2" cy="0" r="1.2" fill="#93C5FD"/>
      </g>
      <g id="flame">
        <polygon points="-18,0 -26,3 -26,-3" fill="#F59E0B">
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
