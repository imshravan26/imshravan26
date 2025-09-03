#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");

console.log("🎭 Updating your programming meme...\n");

const updateScript = path.join(__dirname, "update_meme.js");

exec(`node "${updateScript}"`, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Failed to update meme:", error.message);
    process.exit(1);
  }

  if (stderr) {
    console.log("⚠️  Warnings:", stderr);
  }

  console.log(stdout);

  console.log("\n🎉 Meme update complete!");
  console.log(
    "💡 Tip: The new meme should now be visible in your GitHub profile!"
  );
});
