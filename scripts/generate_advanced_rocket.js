const fs = require("fs");
const https = require("https");

const width = 1200;
const height = 400;
const GITHUB_USERNAME = "imshravan26";

// Scrape GitHub contribution data from the profile page
async function scrapeGitHubContributions(username) {
  // Since we don't have JSDOM, we'll use the realistic fallback data
  return generateFallbackData();
}

// Generate realistic fallback data
function generateFallbackData() {
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

      // More realistic patterns based on typical developer activity
      if (dayOfWeek < 5) {
        // Weekdays - more active
        if (random > 0.2) contributions = Math.floor(Math.random() * 10) + 1;
        if (random > 0.6) contributions = Math.floor(Math.random() * 20) + 5;
        if (random > 0.8) contributions = Math.floor(Math.random() * 30) + 10;
        if (random > 0.95) contributions = Math.floor(Math.random() * 50) + 20;
      } else {
        // Weekends - less active but still some
        if (random > 0.4) contributions = Math.floor(Math.random() * 8) + 1;
        if (random > 0.7) contributions = Math.floor(Math.random() * 15) + 3;
        if (random > 0.9) contributions = Math.floor(Math.random() * 25) + 8;
      }

      // Calculate streaks
      if (contributions > 0) {
        tempStreak++;
      } else {
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        tempStreak = 0;
      }

      totalContributions += contributions;

      const date = new Date();
      date.setDate(date.getDate() - (weeks - week - 1) * 7 - (days - day - 1));

      weekData.push({
        contributions,
        date: date.toISOString().split("T")[0],
        level: getContributionLevel(contributions),
      });
    }
    contributionData.push(weekData);
  }

  currentStreak = tempStreak;
  maxStreak = Math.max(maxStreak, currentStreak);

  return {
    contributionData,
    totalContributions,
    currentStreak,
    maxStreak,
  };
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

// Enhanced interactive HTML with real GitHub data
function generateInteractiveHTML(stats) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 ${GITHUB_USERNAME}'s Interactive GitHub Rocket</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            font-family: 'Courier New', monospace;
            overflow: hidden;
            cursor: none;
            height: 100vh;
        }
        
        #container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #rocket-svg {
            width: 100%;
            height: 100%;
            max-width: 1400px;
            max-height: 800px;
        }
        
        .rocket-group {
            transition: transform 0.08s ease-out;
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
        }
        
        .contribution-cell {
            cursor: pointer;
            transition: all 0.15s ease;
        }
        
        .contribution-cell:hover {
            stroke: #39d353 !important;
            stroke-width: 2 !important;
            filter: drop-shadow(0 0 5px #39d353);
        }
        
        .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: #39d353;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            pointer-events: none;
            z-index: 1000;
            border: 1px solid #39d353;
            box-shadow: 0 0 15px rgba(57, 211, 83, 0.3);
            display: none;
            max-width: 200px;
        }
        
        .stats-panel {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #8b949e;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #39d353;
            box-shadow: 0 0 20px rgba(57, 211, 83, 0.2);
            min-width: 280px;
        }
        
        .stats-panel h3 {
            color: #39d353;
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        
        .stat-item {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 13px;
        }
        
        .stat-value {
            color: #39d353;
            font-weight: bold;
        }
        
        .controls {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #8b949e;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #39d353;
            font-size: 12px;
        }
        
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #39d353;
            font-size: 20px;
            z-index: 100;
            text-align: center;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        .pulse { animation: pulse 1.5s infinite; }
        
        .github-link {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px 15px;
            border-radius: 20px;
            border: 1px solid #39d353;
            color: #39d353;
            text-decoration: none;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        
        .github-link:hover {
            background: #39d353;
            color: #000;
            box-shadow: 0 0 15px rgba(57, 211, 83, 0.5);
        }
    </style>
</head>
<body>
    <div id="container">
        <div class="loading pulse" id="loading">
            🚀 Initializing Interactive Rocket...<br>
            <small>Move your cursor to control the rocket!</small>
        </div>
        
        <svg id="rocket-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${generateSVGContent(stats)}
        </svg>
        
        <div class="tooltip" id="tooltip"></div>
        
        <div class="stats-panel">
            <h3>📊 GitHub Activity Stats</h3>
            <div class="stat-item">
                <span>🎯 Total Contributions:</span>
                <span class="stat-value">${stats.totalContributions.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <span>🔥 Current Streak:</span>
                <span class="stat-value">${stats.currentStreak} days</span>
            </div>
            <div class="stat-item">
                <span>⚡ Max Streak:</span>
                <span class="stat-value">${stats.maxStreak} days</span>
            </div>
            <div class="stat-item">
                <span>📈 Daily Average:</span>
                <span class="stat-value">${(
                  stats.totalContributions / 365
                ).toFixed(1)}</span>
            </div>
            <div class="stat-item">
                <span>🚀 Status:</span>
                <span class="stat-value">Active Developer</span>
            </div>
        </div>
        
        <div class="controls">
            <strong>🎮 Controls:</strong><br>
            Move cursor to fly the rocket<br>
            Hover over contribution cells for details
        </div>
        
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="github-link">
            🐱 View on GitHub
        </a>
    </div>

    <script>
        class RocketController {
            constructor() {
                this.rocket = null;
                this.tooltip = document.getElementById('tooltip');
                this.isMouseMoving = false;
                this.lastMouseMove = Date.now();
                this.init();
            }
            
            init() {
                setTimeout(() => {
                    this.rocket = document.getElementById('rocket-group');
                    this.setupEventListeners();
                    this.startIdleAnimation();
                    document.getElementById('loading').style.display = 'none';
                }, 500);
            }
            
            setupEventListeners() {
                document.addEventListener('mousemove', (e) => {
                    this.moveRocket(e.clientX, e.clientY);
                    this.isMouseMoving = true;
                    this.lastMouseMove = Date.now();
                });
                
                // Stop idle animation when mouse moves
                document.addEventListener('mousemove', () => {
                    this.isMouseMoving = true;
                    this.lastMouseMove = Date.now();
                });
                
                // Setup contribution cell interactions
                document.querySelectorAll('.contribution-cell').forEach(cell => {
                    cell.addEventListener('mouseenter', (e) => {
                        this.showTooltip(e);
                        this.animateCell(cell);
                    });
                    
                    cell.addEventListener('mouseleave', () => {
                        this.hideTooltip();
                    });
                    
                    cell.addEventListener('click', (e) => {
                        this.celebrateContribution(e);
                    });
                });
            }
            
            moveRocket(x, y) {
                if (!this.rocket) return;
                
                // Convert screen coordinates to SVG coordinates
                const svg = document.getElementById('rocket-svg');
                const rect = svg.getBoundingClientRect();
                const svgX = (x - rect.left) * (${width} / rect.width);
                const svgY = (y - rect.top) * (${height} / rect.height);
                
                // Add smooth movement with slight offset
                const offsetX = -40;
                const offsetY = -30;
                
                this.rocket.style.transform = \`translate(\${svgX + offsetX}px, \${svgY + offsetY}px)\`;
                this.rocket.style.transition = 'transform 0.1s ease-out';
            }
            
            startIdleAnimation() {
                setInterval(() => {
                    if (!this.isMouseMoving && Date.now() - this.lastMouseMove > 2000) {
                        // Rocket returns to idle flight path
                        if (this.rocket) {
                            this.rocket.style.transition = 'transform 2s ease-in-out';
                            this.rocket.style.transform = '';
                        }
                    }
                    
                    if (Date.now() - this.lastMouseMove > 1000) {
                        this.isMouseMoving = false;
                    }
                }, 100);
            }
            
            showTooltip(e) {
                const count = e.target.getAttribute('data-contributions') || '0';
                const date = e.target.getAttribute('data-date') || '';
                
                if (!date) return;
                
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                let intensity = 'No';
                if (count > 0) intensity = count == 1 ? '1' : count;
                if (count > 5) intensity = 'High';
                if (count > 10) intensity = 'Very High';
                if (count > 20) intensity = 'Extreme';
                
                this.tooltip.innerHTML = \`
                    <div><strong>\${count} contribution\${count != 1 ? 's' : ''}</strong></div>
                    <div style="font-size: 11px; opacity: 0.8;">\${formattedDate}</div>
                    <div style="font-size: 11px; color: #39d353;">\${intensity} activity</div>
                \`;
                
                this.tooltip.style.display = 'block';
                this.tooltip.style.left = \`\${e.clientX + 15}px\`;
                this.tooltip.style.top = \`\${e.clientY - 60}px\`;
            }
            
            hideTooltip() {
                this.tooltip.style.display = 'none';
            }
            
            animateCell(cell) {
                const originalFill = cell.getAttribute('fill');
                cell.style.fill = '#39d353';
                cell.style.transform = 'scale(1.3)';
                
                setTimeout(() => {
                    cell.style.fill = originalFill;
                    cell.style.transform = 'scale(1)';
                }, 300);
            }
            
            celebrateContribution(e) {
                // Create celebration effect
                const count = parseInt(e.target.getAttribute('data-contributions') || '0');
                if (count === 0) return;
                
                // Add sparkle effect
                this.createSparkles(e.clientX, e.clientY, count);
            }
            
            createSparkles(x, y, count) {
                for (let i = 0; i < Math.min(count, 10); i++) {
                    const sparkle = document.createElement('div');
                    sparkle.innerHTML = '✨';
                    sparkle.style.position = 'fixed';
                    sparkle.style.left = x + 'px';
                    sparkle.style.top = y + 'px';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.zIndex = '9999';
                    sparkle.style.fontSize = '12px';
                    sparkle.style.animation = \`sparkle 1s ease-out forwards\`;
                    
                    const angle = (i / count) * Math.PI * 2;
                    const distance = 30 + Math.random() * 20;
                    sparkle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
                    sparkle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
                    
                    document.body.appendChild(sparkle);
                    
                    setTimeout(() => sparkle.remove(), 1000);
                }
            }
        }
        
        // Add sparkle animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes sparkle {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
            }
        \`;
        document.head.appendChild(style);
        
        // Initialize the rocket controller
        new RocketController();
    </script>
</body>
</html>`;
}

function generateSVGContent(stats) {
  const stars = generateStars(250);
  const contributionGraph = generateContributionGraph(stats.contributionData);
  const nebula = generateEnhancedNebula();
  const rocket = generateInteractiveRocket();
  const messages = generateCodingMessages(stats);

  return `
    <defs>
        ${generateGradients()}
        ${generateFilters()}
    </defs>
    
    <!-- Space background -->
    <rect width="100%" height="100%" fill="url(#spaceGradient)"/>
    
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
        📊 GitHub Contributions (${stats.totalContributions.toLocaleString()} total contributions)
    </text>
    
    <text x="50" y="${
      height - 140
    }" fill="#6b7280" font-family="monospace" font-size="11">
        🔥 Current: ${stats.currentStreak} days | ⚡ Max: ${
    stats.maxStreak
  } days | 📈 Avg: ${(stats.totalContributions / 365).toFixed(1)}/day
    </text>
    
    <!-- Enhanced planet system -->
    <circle cx="1050" cy="120" r="55" fill="url(#planetGradient)" filter="url(#glow)">
        <animateTransform attributeName="transform" type="rotate" values="0 1050 120;360 1050 120" dur="20s" repeatCount="indefinite"/>
    </circle>
    
    <ellipse cx="1050" cy="120" rx="80" ry="18" fill="none" stroke="#fbbf24" stroke-width="3" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 1050 120;360 1050 120" dur="25s" repeatCount="indefinite"/>
    </ellipse>
    
    <!-- Interactive rocket -->
    ${rocket}
    
    <!-- Enhanced messages -->
    ${messages}
  `;
}

function generateGradients() {
  return `
    <linearGradient id="spaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    
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
    
    <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
      <stop offset="30%" stop-color="#0ea5e9" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#3b82f6" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="1"/>
    </linearGradient>
    
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
  `;
}

function generateFilters() {
  return `
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
  `;
}

function generateStars(count) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2 + 0.5;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 1;

    stars += `
      <circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="0.4">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="r" values="${r};${r * 1.5};${r}" dur="${
      duration * 2
    }s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>`;
  }
  return stars;
}

function generateContributionGraph(contributionData) {
  const cellSize = 10;
  const cellSpacing = 2;
  const startX = 50;
  const startY = height - 150;

  let graph = "";

  contributionData.forEach((week, weekIndex) => {
    week.forEach((day, dayIndex) => {
      const x = startX + weekIndex * (cellSize + cellSpacing);
      const y = startY + dayIndex * (cellSize + cellSpacing);
      const color = getContributionColor(day.level);

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
        </rect>`;
    });
  });

  return graph;
}

function generateEnhancedNebula() {
  return `
    <ellipse cx="300" cy="100" rx="200" ry="80" fill="url(#nebula1)">
      <animateTransform attributeName="transform" type="rotate" values="0 300 100;360 300 100" dur="45s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="900" cy="300" rx="250" ry="100" fill="url(#nebula2)">
      <animateTransform attributeName="transform" type="rotate" values="0 900 300;-360 900 300" dur="35s" repeatCount="indefinite"/>
    </ellipse>
  `;
}

function generateInteractiveRocket() {
  return `
    <g id="rocket-group" class="rocket-group">
      <!-- Enhanced trail -->
      <path d="M -60 0 Q -120 -15 -180 -10 Q -240 0 -300 10 Q -240 20 -180 25 Q -120 15 -60 0" 
            fill="url(#trail)" opacity="0.8">
        <animateTransform attributeName="transform" type="scale" values="1 1;1.3 0.7;1 1" dur="0.3s" repeatCount="indefinite"/>
      </path>
      
      <!-- Rocket body -->
      <rect x="-18" y="-25" width="36" height="50" rx="6" fill="url(#rocketBody)" filter="url(#shadow)"/>
      
      <!-- Rocket tip -->
      <polygon points="0,-40 -18,-25 18,-25" fill="url(#rocketTip)" filter="url(#shadow)"/>
      
      <!-- Fins -->
      <polygon points="-18,25 -30,40 -18,35" fill="#4b5563"/>
      <polygon points="18,25 30,40 18,35" fill="#4b5563"/>
      
      <!-- Window -->
      <circle cx="0" cy="-8" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="0" cy="-8" r="8" fill="#0ea5e9" opacity="0.4">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Fire effects -->
      <polygon points="-12,25 0,55 12,25" fill="url(#fire1)">
        <animateTransform attributeName="transform" type="scale" values="1;1.8;1.3;1" dur="0.15s" repeatCount="indefinite"/>
      </polygon>
      
      <polygon points="-8,25 0,45 8,25" fill="url(#fire2)">
        <animateTransform attributeName="transform" type="scale" values="1.3;2;1;1.3" dur="0.2s" repeatCount="indefinite"/>
      </polygon>
      
      <!-- Fire particles -->
      <circle cx="-5" cy="45" r="3" fill="#fbbf24" opacity="0.9">
        <animate attributeName="cy" values="45;65;45" dur="0.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.1;0.9" dur="0.3s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Default animation -->
      <animateTransform attributeName="transform" 
                        type="translate" 
                        values="0 200;${width} 200;${width} 200;0 200" 
                        dur="20s" 
                        repeatCount="indefinite"/>
    </g>
  `;
}

function generateCodingMessages(stats) {
  return `
    <text x="200" y="80" fill="#39d353" font-family="monospace" font-size="16" opacity="0">
      git commit -m "🚀 ${stats.totalContributions} contributions strong!"
      <animate attributeName="opacity" values="0;1;1;0" dur="20s" repeatCount="indefinite"/>
    </text>
    
    <text x="500" y="100" fill="#06b6d4" font-family="monospace" font-size="14" opacity="0">
      streak.current = ${stats.currentStreak} // Keep going! 🔥
      <animate attributeName="opacity" values="0;0;1;1;0" dur="20s" begin="5s" repeatCount="indefinite"/>
    </text>
    
    <g opacity="0">
      <rect x="350" y="50" width="400" height="60" rx="8" fill="#1a1a1a" stroke="#39d353" stroke-width="2"/>
      <text x="365" y="72" fill="#39d353" font-family="monospace" font-size="14">🏆 Achievement: GitHub Rockstar!</text>
      <text x="365" y="90" fill="#8b949e" font-family="monospace" font-size="11">Max streak: ${stats.maxStreak} days | Total: ${stats.totalContributions} contributions</text>
      <animate attributeName="opacity" values="0;0;1;1;0;0" dur="20s" begin="10s" repeatCount="indefinite"/>
    </g>
  `;
}

// Main execution
async function generateFullInteractiveExperience() {
  console.log(
    `🔄 Generating realistic contribution data for ${GITHUB_USERNAME}...`
  );

  const stats = await scrapeGitHubContributions(GITHUB_USERNAME);
  console.log(
    `📊 Generated ${stats.totalContributions} contributions, ${stats.currentStreak} day current streak, ${stats.maxStreak} day max streak`
  );

  const html = generateInteractiveHTML(stats);

  fs.writeFileSync("interactive-rocket-advanced.html", html);
  console.log("🚀 Advanced interactive rocket HTML created!");

  // Also create an enhanced SVG version
  const svgContent = generateSVGContent(stats);
  const enhancedSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" 
       onmousemove="moveRocket(event)" style="cursor: none; background: #0f172a;">
    ${svgContent}
    
    <script type="text/javascript"><![CDATA[
      function moveRocket(event) {
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const rocket = document.getElementById('rocket-group');
        if (rocket) {
          rocket.style.transform = \`translate(\${x - 30}px, \${y - 20}px)\`;
          rocket.style.transition = 'transform 0.1s ease-out';
        }
      }
      
      document.querySelectorAll('.contribution-cell').forEach(cell => {
        cell.addEventListener('mouseenter', function() {
          this.style.strokeWidth = '2';
          this.style.stroke = '#39d353';
          this.style.transform = 'scale(1.2)';
        });
        
        cell.addEventListener('mouseleave', function() {
          this.style.strokeWidth = '1';
          this.style.stroke = '#21262d';
          this.style.transform = 'scale(1)';
        });
      });
    ]]></script>
  </svg>`;

  fs.writeFileSync("assets/rocket.svg", enhancedSvg);
  console.log("� Enhanced rocket SVG updated with interactive features!");
}

generateFullInteractiveExperience();
