import fs from "fs";

const MEMES = [
  "https://i.imgur.com/6X4Qq1T.jpeg",
  "https://i.imgur.com/0UQ9tBA.jpeg",
  "https://i.imgur.com/8bH0pGk.jpeg",
  "https://i.imgur.com/8rQb3yB.jpeg",
  "https://i.imgur.com/2lYdpmc.jpeg",
  "https://i.imgur.com/8QO6x3W.jpeg",
  "https://i.imgur.com/t3cK0o9.jpeg",
];

function pickToday() {
  const now = new Date();
  const dayIndex = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
      86400000
  );
  return MEMES[dayIndex % MEMES.length];
}

function updateReadme(url) {
  const path = "README.md";
  const start = "<!-- meme start -->";
  const end = "<!-- meme end -->";
  const md = fs.readFileSync(path, "utf8");
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  const block = `${start}\n\n![Random Dev Meme](${url})\n\n${end}`;
  const next = md.replace(pattern, block);
  if (next !== md) {
    fs.writeFileSync(path, next, "utf8");
    console.log("README meme block updated.");
  } else {
    console.log("README meme block unchanged.");
  }
}

updateReadme(pickToday());
