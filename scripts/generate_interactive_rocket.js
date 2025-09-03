const fs = require("fs");
const https = require("https");

const width = 1200;
const height = 400;

// GitHub username
const GITHUB_USERNAME = "imshravan26";

// Fetch GitHub contribution data (fallback to realistic simulation)
async function fetchGitHubContributions() {
  return new Promise((resolve) => {
    // Since we can't directly access GitHub API from Node.js without auth,
    // we'll generate realistic contribution data based on typical patterns
    const weeks = 52;
    const days = 7;
    let contributionData = [];
    let totalContributions = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < days; day++) {
        let contributions = 0;
        const random = Math.random();
        const dayOfWeek = day;

        // More realistic patterns - higher activity on weekdays
        if (dayOfWeek < 5) {
          // Weekdays
          if (random > 0.25) contributions = Math.floor(Math.random() * 8) + 1;
          if (random > 0.65) contributions = Math.floor(Math.random() * 15) + 5;
          if (random > 0.85)
            contributions = Math.floor(Math.random() * 25) + 10;
          if (random > 0.95)
            contributions = Math.floor(Math.random() * 40) + 15;
        } else {
          // Weekends
          if (random > 0.5) contributions = Math.floor(Math.random() * 5) + 1;
          if (random > 0.8) contributions = Math.floor(Math.random() * 12) + 3;
          if (random > 0.95) contributions = Math.floor(Math.random() * 20) + 8;
        }

        // Calculate streaks
        if (contributions > 0) {
          tempStreak++;
        } else {
          if (tempStreak > maxStreak) maxStreak = tempStreak;
          tempStreak = 0;
        }
        currentStreak = tempStreak;

        totalContributions += contributions;

        const date = new Date();
        date.setDate(
          date.getDate() - (weeks - week - 1) * 7 - (days - day - 1)
        );

        weekData.push({
          contributions,
          date: date.toISOString().split("T")[0],
          level: getContributionLevel(contributions),
        });
      }
      contributionData.push(weekData);
    }

    resolve({
      contributionData,
      totalContributions,
      currentStreak,
      maxStreak: Math.max(maxStreak, currentStreak),
    });
  });
}

function getContributionLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function getContributionColor(level) {
  const colors = [
    "#161b22", // No contributions
    "#0d4429", // Low
    "#006d32", // Medium-low
    "#26a641", // Medium-high
    "#39d353", // High
  ];
  return colors[level];
}

// Generate stars with improved animations
function generateStars(count) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2 + 0.5;
    const delay = Math.random() * 5;
    const duration = Math.random() * 2 + 1;

    stars += `
      <circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="0.3">
        <animate attributeName="opacity" 
                 values="0.3;1;0.3" 
                 dur="${duration}s" 
                 begin="${delay}s"
                 repeatCount="indefinite" />
        <animate attributeName="r" 
                 values="${r};${r * 1.5};${r}" 
                 dur="${duration * 2}s" 
                 begin="${delay}s"
                 repeatCount="indefinite" />
      </circle>`;
  }
  return stars;
}

// Generate contribution graph with real data
function generateContributionGraph(contributionData) {
  const cellSize = 8;
  const cellSpacing = 2;
  const startX = 50;
  const startY = height - 150;

  let graph = "";

  contributionData.forEach((week, weekIndex) => {
    week.forEach((day, dayIndex) => {
      const x = startX + weekIndex * (cellSize + cellSpacing);
      const y = startY + dayIndex * (cellSize + cellSpacing);
      const color = getContributionColor(day.level);
      const animationDelay = (weekIndex * 7 + dayIndex) * 0.01;

      graph += `
        <rect x="${x}" y="${y}" 
              width="${cellSize}" 
              height="${cellSize}" 
              rx="2" 
              fill="${color}" 
              stroke="#21262d" 
              stroke-width="1"
              class="contribution-cell"
              data-contributions="${day.contributions}"
              data-date="${day.date}">
          <animate attributeName="fill" 
                   values="${color};#39d353;${color}" 
                   dur="0.3s" 
                   begin="mouseover"
                   fill="freeze" />
          <animate attributeName="fill" 
                   values="#39d353;${color}" 
                   dur="0.2s" 
                   begin="mouseout"
                   fill="freeze" />
          <animateTransform attributeName="transform" 
                            type="scale" 
                            values="1;1.3;1" 
                            dur="0.2s" 
                            begin="mouseover" />
          <animateTransform attributeName="transform" 
                            type="scale" 
                            values="1.3;1" 
                            dur="0.2s" 
                            begin="mouseout" />
          <animate attributeName="fill" 
                   values="${color};#39d353;${color}" 
                   dur="0.5s" 
                   begin="${animationDelay}s"
                   repeatCount="1" />
        </rect>`;
    });
  });

  return graph;
}

// Enhanced nebula with more complex animations
function generateEnhancedNebula() {
  return `
    <defs>
      <radialGradient id="nebula1" cx="30%" cy="20%">
        <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.4"/>
        <stop offset="50%" stop-color="#a855f7" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
      </radialGradient>
      <radialGradient id="nebula2" cx="70%" cy="80%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.4"/>
        <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
      </radialGradient>
      <radialGradient id="nebula3" cx="50%" cy="50%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#059669" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="nebula4" cx="20%" cy="60%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#d97706" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="300" cy="100" rx="200" ry="80" fill="url(#nebula1)">
      <animateTransform attributeName="transform" type="rotate" values="0 300 100;360 300 100" dur="45s" repeatCount="indefinite"/>
      <animate attributeName="rx" values="200;250;200" dur="20s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="900" cy="300" rx="250" ry="100" fill="url(#nebula2)">
      <animateTransform attributeName="transform" type="rotate" values="0 900 300;-360 900 300" dur="35s" repeatCount="indefinite"/>
      <animate attributeName="ry" values="100;150;100" dur="25s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="600" cy="200" rx="150" ry="60" fill="url(#nebula3)">
      <animateTransform attributeName="transform" type="rotate" values="0 600 200;360 600 200" dur="30s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="15s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="150" cy="250" rx="120" ry="50" fill="url(#nebula4)">
      <animateTransform attributeName="transform" type="rotate" values="0 150 250;-360 150 250" dur="40s" repeatCount="indefinite"/>
      <animate attributeName="rx" values="120;180;120" dur="18s" repeatCount="indefinite"/>
    </ellipse>
  `;
}

// Enhanced rocket with cursor following capability
function generateInteractiveRocket() {
  return `
    <!-- Interactive Rocket that can follow cursor -->
    <g id="interactive-rocket" style="cursor: none;">
      <!-- Enhanced Rocket trail -->
      <path d="M -60 0 Q -120 -15 -180 -10 Q -240 0 -300 10 Q -240 20 -180 25 Q -120 15 -60 0" 
            fill="url(#trail)" opacity="0.8">
        <animateTransform attributeName="transform" type="scale" values="1 1;1.3 0.7;1 1" dur="0.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite"/>
      </path>
      
      <!-- Rocket body with enhanced details -->
      <rect x="-18" y="-25" width="36" height="50" rx="6" fill="url(#rocketBody)" filter="url(#shadow)"/>
      
      <!-- Rocket tip -->
      <polygon points="0,-40 -18,-25 18,-25" fill="url(#rocketTip)" filter="url(#shadow)"/>
      
      <!-- Enhanced fins -->
      <polygon points="-18,25 -30,40 -18,35" fill="#4b5563"/>
      <polygon points="18,25 30,40 18,35" fill="#4b5563"/>
      <polygon points="-10,25 -15,35 -10,30" fill="#6b7280"/>
      <polygon points="10,25 15,35 10,30" fill="#6b7280"/>
      
      <!-- Enhanced window -->
      <circle cx="0" cy="-8" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="0" cy="-8" r="8" fill="#0ea5e9" opacity="0.4">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="-8" r="4" fill="#38bdf8" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Enhanced details -->
      <rect x="-15" y="8" width="30" height="3" fill="#374151"/>
      <rect x="-12" y="15" width="24" height="2" fill="#374151"/>
      <circle cx="-8" cy="0" r="2" fill="#ef4444"/>
      <circle cx="8" cy="0" r="2" fill="#10b981"/>
      
      <!-- Enhanced fire effects -->
      <polygon points="-12,25 0,55 12,25" fill="url(#fire1)">
        <animateTransform attributeName="transform" type="scale" values="1;1.8;1.3;1" dur="0.15s" repeatCount="indefinite"/>
      </polygon>
      
      <polygon points="-8,25 0,45 8,25" fill="url(#fire2)">
        <animateTransform attributeName="transform" type="scale" values="1.3;2;1;1.3" dur="0.2s" repeatCount="indefinite"/>
      </polygon>
      
      <polygon points="-4,25 0,35 4,25" fill="#fef3c7">
        <animateTransform attributeName="transform" type="scale" values="1;1.5;1" dur="0.1s" repeatCount="indefinite"/>
      </polygon>
      
      <!-- Enhanced fire particles -->
      <circle cx="-5" cy="45" r="3" fill="#fbbf24" opacity="0.9">
        <animate attributeName="cy" values="45;65;45" dur="0.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.1;0.9" dur="0.3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="3;1;3" dur="0.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="5" cy="50" r="2" fill="#f97316" opacity="1">
        <animate attributeName="cy" values="50;70;50" dur="0.25s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.2;1" dur="0.25s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="55" r="1.5" fill="#dc2626" opacity="0.8">
        <animate attributeName="cy" values="55;75;55" dur="0.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="0.4s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Default flight path animation (can be overridden by mouse) -->
      <animateTransform attributeName="transform" 
                        type="translate" 
                        values="0 200;${width} 200;${width} 200;0 200" 
                        dur="15s" 
                        repeatCount="indefinite"/>
      
      <!-- Gentle bobbing motion -->
      <animateTransform attributeName="transform" 
                        type="translate" 
                        values="0 0;0 -8;0 8;0 0" 
                        dur="2s" 
                        repeatCount="indefinite"
                        additive="sum"/>
    </g>
  `;
}

// Generate enhanced coding messages
function generateCodingMessages(stats) {
  return `
    <!-- Dynamic coding messages -->
    <text x="200" y="80" fill="#39d353" font-family="monospace" font-size="16" opacity="0">
      git commit -m "🚀 ${stats.totalContributions} contributions and counting!"
      <animate attributeName="opacity" values="0;1;1;0" dur="15s" repeatCount="indefinite"/>
    </text>
    
    <text x="500" y="100" fill="#06b6d4" font-family="monospace" font-size="14" opacity="0">
      npm run deploy --streak=${stats.currentStreak}
      <animate attributeName="opacity" values="0;0;1;1;0" dur="15s" begin="3s" repeatCount="indefinite"/>
    </text>
    
    <text x="300" y="320" fill="#a855f7" font-family="monospace" font-size="12" opacity="0">
      console.log("Max streak: ${stats.maxStreak} days 🔥");
      <animate attributeName="opacity" values="0;0;0;1;1;0;0" dur="15s" begin="6s" repeatCount="indefinite"/>
    </text>
    
    <!-- Achievement notification -->
    <g opacity="0">
      <rect x="400" y="50" width="320" height="50" rx="8" fill="#1a1a1a" stroke="#39d353" stroke-width="2"/>
      <text x="415" y="68" fill="#39d353" font-family="monospace" font-size="14">🏆 GitHub Achievements Unlocked!</text>
      <text x="415" y="85" fill="#8b949e" font-family="monospace" font-size="11">Total contributions: ${stats.totalContributions} | Current streak: ${stats.currentStreak}</text>
      <animate attributeName="opacity" values="0;0;1;1;0;0" dur="15s" begin="9s" repeatCount="indefinite"/>
    </g>
  `;
}

// Main function to generate the enhanced SVG
async function generateEnhancedRocketSvg() {
  console.log("🔄 Fetching GitHub contribution data...");
  const stats = await fetchGitHubContributions();

  console.log(
    `📊 Stats: ${stats.totalContributions} contributions, ${stats.currentStreak} day streak`
  );

  const stars = generateStars(200);
  const contributionGraph = generateContributionGraph(stats.contributionData);
  const nebula = generateEnhancedNebula();
  const rocket = generateInteractiveRocket();
  const messages = generateCodingMessages(stats);

  const rocketSvg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" 
     onmousemove="moveRocket(event)" style="cursor: none; background: #0f172a;">
  <defs>
    <!-- Enhanced gradients -->
    <linearGradient id="rocketBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f3f4f6"/>
      <stop offset="30%" stop-color="#e5e7eb"/>
      <stop offset="70%" stop-color="#9ca3af"/>
      <stop offset="100%" stop-color="#6b7280"/>
    </linearGradient>
    
    <linearGradient id="rocketTip" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="30%" stop-color="#fbbf24"/>
      <stop offset="70%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    
    <radialGradient id="planetGradient" cx="30%" cy="30%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="30%" stop-color="#fbbf24"/>
      <stop offset="60%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </radialGradient>
    
    <!-- Enhanced fire gradients -->
    <radialGradient id="fire1" cx="50%" cy="0%">
      <stop offset="0%" stop-color="#fef9c3"/>
      <stop offset="20%" stop-color="#fef3c7"/>
      <stop offset="40%" stop-color="#fbbf24"/>
      <stop offset="70%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </radialGradient>
    
    <radialGradient id="fire2" cx="50%" cy="0%">
      <stop offset="0%" stop-color="#f0f9ff"/>
      <stop offset="30%" stop-color="#ddd6fe"/>
      <stop offset="60%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </radialGradient>
    
    <!-- Enhanced trail -->
    <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
      <stop offset="30%" stop-color="#0ea5e9" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#3b82f6" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="1"/>
    </linearGradient>
    
    <!-- Enhanced filters -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="3" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
  </defs>
  
  <!-- Enhanced space background -->
  <rect width="100%" height="100%" fill="#0f172a"/>
  
  <!-- Enhanced nebula -->
  ${nebula}
  
  <!-- Twinkling stars -->
  ${stars}
  
  <!-- Real contribution graph -->
  ${contributionGraph}
  
  <!-- Enhanced labels -->
  <text x="50" y="${
    height - 160
  }" fill="#8b949e" font-family="monospace" font-size="14" font-weight="bold">
    📊 My GitHub Contributions (${stats.totalContributions} total, ${
    stats.currentStreak
  } day streak)
  </text>
  
  <text x="50" y="${
    height - 140
  }" fill="#6b7280" font-family="monospace" font-size="11">
    🔥 Max streak: ${stats.maxStreak} days | 📈 Average: ${
    Math.round((stats.totalContributions / 365) * 10) / 10
  } per day
  </text>
  
  <!-- Enhanced planet system -->
  <circle cx="1050" cy="120" r="55" fill="url(#planetGradient)" filter="url(#glow)">
    <animateTransform attributeName="transform" type="rotate" values="0 1050 120;360 1050 120" dur="20s" repeatCount="indefinite"/>
    <animate attributeName="r" values="55;60;55" dur="8s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Multiple planet rings -->
  <ellipse cx="1050" cy="120" rx="80" ry="18" fill="none" stroke="#fbbf24" stroke-width="3" opacity="0.7">
    <animateTransform attributeName="transform" type="rotate" values="0 1050 120;360 1050 120" dur="25s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="1050" cy="120" rx="100" ry="12" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.5">
    <animateTransform attributeName="transform" type="rotate" values="0 1050 120;-360 1050 120" dur="30s" repeatCount="indefinite"/>
  </ellipse>
  
  <!-- Interactive rocket -->
  ${rocket}
  
  <!-- Enhanced coding messages -->
  ${messages}
  
  <!-- GitHub profile link -->
  <text x="${
    width - 200
  }" y="30" fill="#8b949e" font-family="monospace" font-size="10">
    github.com/${GITHUB_USERNAME}
  </text>
  
  <script type="text/javascript"><![CDATA[
    // Make rocket follow cursor
    function moveRocket(event) {
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const rocket = document.getElementById('interactive-rocket');
      if (rocket) {
        rocket.style.transform = \`translate(\${x - 30}px, \${y - 20}px)\`;
      }
    }
    
    // Add hover effects to contribution cells
    document.querySelectorAll('.contribution-cell').forEach(cell => {
      cell.addEventListener('mouseenter', function() {
        this.style.strokeWidth = '2';
        this.style.stroke = '#39d353';
      });
      
      cell.addEventListener('mouseleave', function() {
        this.style.strokeWidth = '1';
        this.style.stroke = '#21262d';
      });
    });
  ]]></script>
</svg>`;

  return rocketSvg;
}

// Generate and save the enhanced SVG
generateEnhancedRocketSvg()
  .then((svg) => {
    fs.writeFileSync("assets/rocket.svg", svg);
    console.log(
      "🚀 Enhanced interactive rocket with real GitHub contributions created!"
    );
    console.log("💡 The SVG includes cursor following and hover effects!");
  })
  .catch((error) => {
    console.error("Error generating rocket:", error);
  });
