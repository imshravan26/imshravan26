const https = require("https");

// Test script to check all meme sources
const memeSources = [
  {
    name: "Reddit Programming Humor",
    url: "https://www.reddit.com/r/ProgrammerHumor/hot.json?limit=5",
    headers: { "User-Agent": "GitHub-Profile-Meme-Bot/1.0" },
  },
  {
    name: "Reddit Developer Humor",
    url: "https://www.reddit.com/r/developerhumor/hot.json?limit=5",
    headers: { "User-Agent": "GitHub-Profile-Meme-Bot/1.0" },
  },
];

async function testSource(source) {
  return new Promise((resolve, reject) => {
    console.log(`Testing ${source.name}...`);

    const req = https.get(source.url, { headers: source.headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          if (data.trim().startsWith("<!DOCTYPE")) {
            resolve({ success: false, error: "Returned HTML instead of JSON" });
            return;
          }

          const parsed = JSON.parse(data);
          const count = parsed.data?.children?.length || 0;
          resolve({ success: true, count });
        } catch (error) {
          resolve({ success: false, error: error.message });
        }
      });
    });

    req.on("error", (error) =>
      resolve({ success: false, error: error.message })
    );
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: "Timeout" });
    });
  });
}

async function testAllSources() {
  console.log("🧪 Testing all meme sources...\n");

  for (const source of memeSources) {
    const result = await testSource(source);
    if (result.success) {
      console.log(`✅ ${source.name}: Found ${result.count} posts`);
    } else {
      console.log(`❌ ${source.name}: ${result.error}`);
    }
  }

  console.log("\n🎯 Test complete!");
}

testAllSources().catch(console.error);
