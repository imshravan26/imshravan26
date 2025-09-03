const fs = require("fs");
const https = require("https");

const memeUrl = "https://programming-memes-images.p.rapidapi.com/v1/memes";

const options = {
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "programming-memes-images.p.rapidapi.com",
  },
};

https.get(memeUrl, options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    const memes = JSON.parse(data);
    const meme = memes[Math.floor(Math.random() * memes.length)];

    const file = fs.createWriteStream("assets/meme.png");
    https.get(meme.image, (imgRes) => {
      imgRes.pipe(file);
      file.on("finish", () => file.close());
    });
  });
});
