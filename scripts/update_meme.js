const fs = require("fs");
const https = require("https");
const path = require("path");

// Multiple meme sources for better reliability
const memeSources = [
  {
    name: "Programming Memes API",
    url: "https://programming-memes-images.p.rapidapi.com/v1/memes",
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "programming-memes-images.p.rapidapi.com",
    },
    parser: (data) => JSON.parse(data),
    imageExtractor: (meme) => meme.image,
  },
  {
    name: "Reddit Programming Humor",
    url: "https://www.reddit.com/r/ProgrammerHumor/hot.json?limit=50",
    headers: {
      "User-Agent": "GitHub-Profile-Meme-Bot/1.0",
    },
    parser: (data) => {
      const reddit = JSON.parse(data);
      return reddit.data.children
        .filter(
          (post) =>
            post.data.url &&
            (post.data.url.includes(".jpg") ||
              post.data.url.includes(".png") ||
              post.data.url.includes(".gif"))
        )
        .map((post) => ({ image: post.data.url, title: post.data.title }));
    },
    imageExtractor: (meme) => meme.image,
  },
];

// Curated programming memes as fallback (royalty-free meme templates)
const fallbackMemes = [
  {
    text: "When you fix a bug but create two new ones",
    template: "distracted-boyfriend",
  },
  {
    text: "When the code works on my machine but not in production",
    template: "this-is-fine",
  },
  {
    text: "Me explaining why my code didn't work",
    template: "expanding-brain",
  },
  {
    text: "When someone asks me to explain my code from 6 months ago",
    template: "confused-nick-young",
  },
  {
    text: "Frontend vs Backend developers",
    template: "two-buttons",
  },
];

// Generate text-based meme as ultimate fallback
function generateTextMeme() {
  const jokes = [
    "// TODO: Fix this later\n// (6 months later)\n// TODO: Still fix this",
    "99 little bugs in the code\n99 little bugs\nTake one down, patch it around\n117 little bugs in the code",
    "Works on my machine ¯\\_(ツ)_/¯",
    "It's not a bug, it's a feature!",
    "Real programmers count from 0",
    "There are only 10 types of people:\nThose who understand binary\nand those who don't",
    "Programmer (noun):\nAn organism that turns\ncoffee into code",
    "Why do programmers prefer dark mode?\nBecause light attracts bugs!",
    "How many programmers does it take\nto change a light bulb?\nNone, that's a hardware problem",
  ];

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  const timestamp = new Date().toISOString().split("T")[0];

  return `<!-- Generated on ${timestamp} -->\n<div align="center">\n<h3>🤖 Programming Meme of the Day</h3>\n<p><em>${randomJoke}</em></p>\n</div>`;
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(
          new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
        );
        return;
      }
      response.pipe(file);
    });

    file.on("finish", () => {
      file.close();
      resolve();
    });

    file.on("error", (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });

    request.on("error", reject);
  });
}

async function fetchFromSource(source) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: source.headers || {},
    };

    const req = https.get(source.url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const memes = source.parser(data);
          if (memes && memes.length > 0) {
            const randomMeme = memes[Math.floor(Math.random() * memes.length)];
            const imageUrl = source.imageExtractor(randomMeme);
            resolve({ imageUrl, meme: randomMeme, source: source.name });
          } else {
            reject(new Error("No memes found"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function updateMeme() {
  const assetsDir = path.join(__dirname, "..", "assets");
  const memeImagePath = path.join(assetsDir, "meme.png");
  const readmePath = path.join(__dirname, "..", "README.md");

  // Ensure assets directory exists
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log("🎭 Generating random programming meme...");

  // Try each source
  for (const source of memeSources) {
    try {
      console.log(`Trying ${source.name}...`);
      const result = await fetchFromSource(source);

      console.log(`Found meme from ${result.source}`);
      await downloadImage(result.imageUrl, memeImagePath);

      console.log("✅ Meme updated successfully!");
      return;
    } catch (error) {
      console.log(`❌ ${source.name} failed: ${error.message}`);
      continue;
    }
  }

  // If all sources fail, create a text-based meme in README
  console.log("📝 All image sources failed, generating text meme...");

  try {
    const textMeme = generateTextMeme();

    if (fs.existsSync(readmePath)) {
      let readme = fs.readFileSync(readmePath, "utf8");

      // Replace the meme section
      const memeStart = readme.indexOf("## 😂 Random Dev Meme of the Day");
      const memeEnd = readme.indexOf("<!-- meme:end -->");

      if (memeStart !== -1 && memeEnd !== -1) {
        const beforeMeme = readme.substring(0, memeStart);
        const afterMeme = readme.substring(memeEnd);

        readme =
          beforeMeme +
          `## 😂 Random Dev Meme of the Day\n\n${textMeme}\n\n` +
          afterMeme;

        fs.writeFileSync(readmePath, readme);
        console.log("✅ Text meme added to README!");
      }
    }
  } catch (error) {
    console.error("❌ Failed to generate text meme:", error.message);
  }
}

// Run the meme updater
updateMeme().catch(console.error);
