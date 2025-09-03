const { exec } = require("child_process");
const path = require("path");

console.log("🧪 Testing the meme generator...");
console.log("=====================================");

// Test the meme update script
const scriptPath = path.join(__dirname, "update_meme.js");

exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Error running meme generator:", error.message);
    return;
  }

  if (stderr) {
    console.log("⚠️ Warnings:", stderr);
  }

  console.log("📋 Output:");
  console.log(stdout);

  console.log("\n✅ Test completed!");
  console.log(
    "Check the assets/ folder for meme.png or README.md for text memes."
  );
});
