const https = require("https");
const fs = require("fs");

const GITHUB_USERNAME = "imshravan26";

// To use this script with real data, you'll need a GitHub Personal Access Token
// Create one at: https://github.com/settings/tokens
// Add it to a .env file or replace 'YOUR_TOKEN_HERE' below
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "YOUR_TOKEN_HERE";

const query = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

async function fetchRealGitHubContributions() {
  if (GITHUB_TOKEN === "YOUR_TOKEN_HERE") {
    console.log(
      "⚠️  No GitHub token provided. Using realistic simulated data instead."
    );
    console.log(
      "💡 To use real data, get a token from https://github.com/settings/tokens"
    );
    return null;
  }

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query: query,
      variables: { username: GITHUB_USERNAME },
    });

    const options = {
      hostname: "api.github.com",
      path: "/graphql",
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "GitHub-Profile-Rocket",
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseData);

          if (parsed.errors) {
            console.log("❌ GitHub API error:", parsed.errors);
            resolve(null);
            return;
          }

          const calendar =
            parsed.data.user.contributionsCollection.contributionCalendar;
          const contributionData = [];
          let currentStreak = 0;
          let maxStreak = 0;
          let tempStreak = 0;

          // Convert GitHub API data to our format
          calendar.weeks.forEach((week) => {
            const weekData = [];
            week.contributionDays.forEach((day) => {
              const count = day.contributionCount;

              // Calculate streaks
              if (count > 0) {
                tempStreak++;
              } else {
                if (tempStreak > maxStreak) maxStreak = tempStreak;
                tempStreak = 0;
              }

              weekData.push({
                contributions: count,
                date: day.date,
                level: getContributionLevel(count),
              });
            });
            contributionData.push(weekData);
          });

          currentStreak = tempStreak;
          maxStreak = Math.max(maxStreak, currentStreak);

          resolve({
            contributionData,
            totalContributions: calendar.totalContributions,
            currentStreak,
            maxStreak,
          });
        } catch (error) {
          console.log("❌ Error parsing GitHub response:", error.message);
          resolve(null);
        }
      });
    });

    req.on("error", (error) => {
      console.log("❌ Request error:", error.message);
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

function getContributionLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

// Generate realistic fallback data when real API isn't available
function generateRealisticContributions() {
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

      // Simulate realistic developer patterns
      if (dayOfWeek < 5) {
        // Weekdays - higher activity
        if (random > 0.15) contributions = Math.floor(Math.random() * 12) + 1;
        if (random > 0.5) contributions = Math.floor(Math.random() * 18) + 3;
        if (random > 0.75) contributions = Math.floor(Math.random() * 25) + 8;
        if (random > 0.9) contributions = Math.floor(Math.random() * 40) + 15;
        if (random > 0.98) contributions = Math.floor(Math.random() * 60) + 25; // Coding marathon days
      } else {
        // Weekends - lower but still some activity
        if (random > 0.4) contributions = Math.floor(Math.random() * 8) + 1;
        if (random > 0.7) contributions = Math.floor(Math.random() * 15) + 3;
        if (random > 0.88) contributions = Math.floor(Math.random() * 25) + 8;
      }

      // Add some periods of high activity (project sprints)
      if (week >= 10 && week <= 14) contributions *= 1.5; // Sprint period
      if (week >= 30 && week <= 34) contributions *= 1.3; // Another active period

      contributions = Math.floor(contributions);

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

// Export functions for use in other scripts
module.exports = {
  fetchRealGitHubContributions,
  generateRealisticContributions,
  GITHUB_USERNAME,
};

// Run directly if called as main script
if (require.main === module) {
  console.log(
    `🔍 Attempting to fetch real GitHub contribution data for ${GITHUB_USERNAME}...`
  );

  fetchRealGitHubContributions().then((realData) => {
    const data = realData || generateRealisticContributions();

    console.log(`📊 Stats: ${data.totalContributions} total contributions`);
    console.log(`🔥 Current streak: ${data.currentStreak} days`);
    console.log(`⚡ Max streak: ${data.maxStreak} days`);
    console.log(
      `📈 Daily average: ${(data.totalContributions / 365).toFixed(
        1
      )} contributions/day`
    );

    // Save the data for other scripts to use
    fs.writeFileSync("contribution-data.json", JSON.stringify(data, null, 2));
    console.log("💾 Contribution data saved to contribution-data.json");

    if (realData) {
      console.log("✅ Used real GitHub API data");
    } else {
      console.log("🎲 Used realistic simulated data");
    }
  });
}
