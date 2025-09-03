const fs = require("fs");

const width = 1200;
const height = 400;

// Generate stars at random positions with twinkling effect
function generateStars(count) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2 + 0.5;
    const delay = Math.random() * 3;
    stars += `
      <circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="0.3">
        <animate attributeName="opacity" 
                 values="0.3;1;0.3" 
                 dur="2s" 
                 begin="${delay}s"
                 repeatCount="indefinite" />
      </circle>`;
  }
  return stars;
}

// Generate GitHub-style contribution graph
function generateContributionGraph() {
  const weeks = 52;
  const days = 7;
  const cellSize = 8;
  const cellSpacing = 2;
  const startX = 50;
  const startY = height - 150;

  let graph = "";
  const contributionLevels = [
    "#161b22",
    "#0d4429",
    "#006d32",
    "#26a641",
    "#39d353",
  ];

  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < days; day++) {
      const x = startX + week * (cellSize + cellSpacing);
      const y = startY + day * (cellSize + cellSpacing);

      // Simulate realistic contribution pattern
      let level = 0;
      if (Math.random() > 0.7) level = 1;
      if (Math.random() > 0.85) level = 2;
      if (Math.random() > 0.93) level = 3;
      if (Math.random() > 0.97) level = 4;

      const color = contributionLevels[level];
      const animationDelay = (week * days + day) * 0.02;

      graph += `
        <rect x="${x}" y="${y}" 
              width="${cellSize}" 
              height="${cellSize}" 
              rx="2" 
              fill="${color}" 
              stroke="#21262d" 
              stroke-width="1">
          <animate attributeName="fill" 
                   values="${color};#39d353;${color}" 
                   dur="0.5s" 
                   begin="${animationDelay}s"
                   repeatCount="1" />
          <animateTransform attributeName="transform" 
                            type="scale" 
                            values="1;1.2;1" 
                            dur="0.3s" 
                            begin="${animationDelay}s"
                            repeatCount="1" />
        </rect>`;
    }
  }

  return graph;
}

// Generate nebula/galaxy background
function generateNebula() {
  let nebula = `
    <defs>
      <radialGradient id="nebula1" cx="30%" cy="20%">
        <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#a855f7" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
      </radialGradient>
      <radialGradient id="nebula2" cx="70%" cy="80%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
      </radialGradient>
      <radialGradient id="nebula3" cx="50%" cy="50%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/>
        <stop offset="50%" stop-color="#059669" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="300" cy="100" rx="200" ry="80" fill="url(#nebula1)">
      <animateTransform attributeName="transform" 
                        type="rotate" 
                        values="0 300 100;360 300 100" 
                        dur="30s" 
                        repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="900" cy="300" rx="250" ry="100" fill="url(#nebula2)">
      <animateTransform attributeName="transform" 
                        type="rotate" 
                        values="0 900 300;-360 900 300" 
                        dur="25s" 
                        repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="600" cy="200" rx="150" ry="60" fill="url(#nebula3)">
      <animateTransform attributeName="transform" 
                        type="rotate" 
                        values="0 600 200;360 600 200" 
                        dur="20s" 
                        repeatCount="indefinite"/>
    </ellipse>
  `;
  return nebula;
}

const stars = generateStars(150);
const contributionGraph = generateContributionGraph();
const nebula = generateNebula();

const rocketSvg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradients for the rocket -->
    <linearGradient id="rocketBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e5e7eb"/>
      <stop offset="50%" stop-color="#9ca3af"/>
      <stop offset="100%" stop-color="#6b7280"/>
    </linearGradient>
    
    <linearGradient id="rocketTip" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    
    <radialGradient id="planetGradient" cx="30%" cy="30%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </radialGradient>
    
    <!-- Fire effect gradients -->
    <radialGradient id="fire1" cx="50%" cy="0%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="30%" stop-color="#fbbf24"/>
      <stop offset="60%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </radialGradient>
    
    <radialGradient id="fire2" cx="50%" cy="0%">
      <stop offset="0%" stop-color="#ddd6fe"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </radialGradient>
    
    <!-- Rocket trail effect -->
    <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
      <stop offset="50%" stop-color="#0ea5e9" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="1"/>
    </linearGradient>
    
    <!-- Glow filter -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Shadow filter -->
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Space background -->
  <rect width="100%" height="100%" fill="#0f172a"/>
  
  <!-- Nebula background -->
  ${nebula}
  
  <!-- Stars -->
  ${stars}
  
  <!-- Contribution graph -->
  ${contributionGraph}
  
  <!-- Contribution graph label -->
  <text x="50" y="${
    height - 160
  }" fill="#8b949e" font-family="monospace" font-size="12">
    Contributions in the last year
  </text>
  
  <!-- Planet -->
  <circle cx="1050" cy="120" r="50" fill="url(#planetGradient)" filter="url(#glow)">
    <animateTransform attributeName="transform" 
                      type="rotate" 
                      values="0 1050 120;360 1050 120" 
                      dur="15s" 
                      repeatCount="indefinite"/>
  </circle>
  
  <!-- Planet rings -->
  <ellipse cx="1050" cy="120" rx="75" ry="15" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.6">
    <animateTransform attributeName="transform" 
                      type="rotate" 
                      values="0 1050 120;360 1050 120" 
                      dur="20s" 
                      repeatCount="indefinite"/>
  </ellipse>
  
  <!-- Rocket with animation -->
  <g>
    <!-- Rocket trail -->
    <path d="M -50 0 Q -100 -10 -150 -5 Q -200 0 -250 5 Q -200 10 -150 15 Q -100 10 -50 0" 
          fill="url(#trail)" opacity="0.7">
      <animateTransform attributeName="transform" 
                        type="scale" 
                        values="1 1;1.2 0.8;1 1" 
                        dur="0.5s" 
                        repeatCount="indefinite"/>
    </path>
    
    <!-- Rocket body -->
    <rect x="-15" y="-20" width="30" height="40" rx="5" fill="url(#rocketBody)" filter="url(#shadow)"/>
    
    <!-- Rocket tip -->
    <polygon points="0,-35 -15,-20 15,-20" fill="url(#rocketTip)" filter="url(#shadow)"/>
    
    <!-- Rocket fins -->
    <polygon points="-15,20 -25,30 -15,30" fill="#4b5563"/>
    <polygon points="15,20 25,30 15,30" fill="#4b5563"/>
    
    <!-- Rocket window -->
    <circle cx="0" cy="-5" r="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="0" cy="-5" r="6" fill="#0ea5e9" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Rocket details -->
    <rect x="-12" y="5" width="24" height="2" fill="#374151"/>
    <rect x="-10" y="10" width="20" height="2" fill="#374151"/>
    
    <!-- Fire effects -->
    <polygon points="-8,20 0,45 8,20" fill="url(#fire1)">
      <animateTransform attributeName="transform" 
                        type="scale" 
                        values="1;1.5;1.2;1" 
                        dur="0.2s" 
                        repeatCount="indefinite"/>
    </polygon>
    
    <polygon points="-5,20 0,35 5,20" fill="url(#fire2)">
      <animateTransform attributeName="transform" 
                        type="scale" 
                        values="1.2;1.8;1;1.2" 
                        dur="0.3s" 
                        repeatCount="indefinite"/>
    </polygon>
    
    <!-- Fire particles -->
    <circle cx="-3" cy="35" r="2" fill="#fbbf24" opacity="0.8">
      <animate attributeName="cy" values="35;50;35" dur="0.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="3" cy="40" r="1.5" fill="#f97316" opacity="0.9">
      <animate attributeName="cy" values="40;55;40" dur="0.3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.9;0.1;0.9" dur="0.3s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Main rocket animation - flying across the screen -->
    <animateTransform attributeName="transform" 
                      type="translate" 
                      values="0 180;1200 180;1200 180;0 180" 
                      dur="12s" 
                      repeatCount="indefinite"/>
    
    <!-- Slight bobbing motion -->
    <animateTransform attributeName="transform" 
                      type="translate" 
                      values="0 0;0 -5;0 5;0 0" 
                      dur="1s" 
                      repeatCount="indefinite"
                      additive="sum"/>
  </g>
  
  <!-- Coding text that appears as rocket flies -->
  <text x="300" y="80" fill="#39d353" font-family="monospace" font-size="16" opacity="0">
    git commit -m "🚀 flying to the stars"
    <animate attributeName="opacity" values="0;1;1;0" dur="12s" repeatCount="indefinite"/>
  </text>
  
  <text x="600" y="100" fill="#06b6d4" font-family="monospace" font-size="14" opacity="0">
    npm run deploy --production
    <animate attributeName="opacity" values="0;0;1;1;0" dur="12s" begin="3s" repeatCount="indefinite"/>
  </text>
  
  <!-- Achievement unlocked -->
  <g opacity="0">
    <rect x="400" y="50" width="250" height="40" rx="5" fill="#1a1a1a" stroke="#39d353" stroke-width="2"/>
    <text x="410" y="65" fill="#39d353" font-family="monospace" font-size="12">🏆 Achievement: Rocket Scientist</text>
    <text x="410" y="78" fill="#8b949e" font-family="monospace" font-size="10">Successfully launched 1000+ commits</text>
    <animate attributeName="opacity" values="0;0;1;1;0;0" dur="12s" begin="6s" repeatCount="indefinite"/>
  </g>
</svg>`;

fs.writeFileSync("assets/rocket.svg", rocketSvg);
console.log("🚀 Epic rocket animation with GitHub contributions created!");
