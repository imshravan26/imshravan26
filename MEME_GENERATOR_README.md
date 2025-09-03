# 🎭 Programming Meme Generator

A robust random programming meme generator for your GitHub profile README that automatically updates with fresh memes daily!

## 🌟 Features

- **Multiple Meme Sources**: Fetches from various APIs for better reliability
- **Automatic Fallback**: If image sources fail, generates text-based programming jokes
- **Daily Updates**: GitHub Actions workflow runs automatically every day
- **Manual Trigger**: Can be run manually anytime
- **Error Handling**: Robust error handling with multiple retry strategies
- **Configurable**: Easy to customize with different categories and preferences

## 🚀 Setup

### 1. Prerequisites

- Node.js (version 14 or higher)
- GitHub repository for your profile (username/username)

### 2. Installation

Clone this repository or copy the relevant files to your GitHub profile repo:

```bash
# Copy these files to your profile repository:
# - scripts/update_meme.js
# - scripts/meme-config.json
# - .github/workflows/update-meme.yml
# - package.json (optional)
```

### 3. GitHub Secrets (Optional)

For enhanced meme sources, add these secrets to your GitHub repository:

1. Go to your repository Settings → Secrets and variables → Actions
2. Add `RAPIDAPI_KEY` (optional - for RapidAPI programming memes)

### 4. README.md Setup

Ensure your README.md has the meme section:

```markdown
## 😂 Random Dev Meme of the Day

![meme](./assets/meme.png)

<!-- meme:end -->
```

## 🎯 Usage

### Automatic Updates (Recommended)

The GitHub Actions workflow will automatically:

- Run daily at 9:00 AM UTC
- Fetch a random programming meme
- Update your profile with the new meme
- Commit changes back to your repository

### Manual Updates

Run locally:

```bash
npm run update-meme
# or
node scripts/update_meme.js
```

### Testing

Test the meme generator:

```bash
node scripts/test-meme-generator.js
```

## 🛠️ Configuration

Edit `scripts/meme-config.json` to customize:

- **Categories**: Types of programming memes to fetch
- **Fallback Jokes**: Text-based jokes when images fail
- **Preferences**: Image format, retry settings, etc.

## 📁 File Structure

```
your-profile-repo/
├── scripts/
│   ├── update_meme.js          # Main meme generator
│   ├── meme-config.json        # Configuration
│   └── test-meme-generator.js  # Testing script
├── .github/workflows/
│   └── update-meme.yml         # GitHub Actions workflow
├── assets/
│   └── meme.png               # Generated meme image
└── README.md                  # Your profile README
```

## 🔧 How It Works

1. **Primary Sources**: Tries to fetch from programming meme APIs
2. **Fallback Sources**: If APIs fail, tries Reddit programming humor
3. **Ultimate Fallback**: If all sources fail, generates text-based programming jokes
4. **Auto-Commit**: GitHub Actions automatically commits the new meme

## 🎨 Customization

### Adding New Meme Sources

Edit `scripts/update_meme.js` and add to the `memeSources` array:

```javascript
{
  name: "Your API Name",
  url: "https://your-api.com/memes",
  headers: { /* your headers */ },
  parser: (data) => { /* parse response */ },
  imageExtractor: (meme) => meme.imageUrl
}
```

### Adding New Fallback Jokes

Edit `scripts/meme-config.json` and add to the `fallbackJokes` array:

```json
{
  "text": "Your programming joke here",
  "category": "programming"
}
```

## 🚀 Advanced Features

- **Smart Retry Logic**: Multiple attempts with different sources
- **Image Validation**: Ensures downloaded images are valid
- **README Integration**: Seamlessly updates README.md with text memes
- **Timezone Support**: Configurable update times
- **Category Filtering**: Filter memes by programming topics

## 📊 Workflow Status

You can check if your meme generator is working by:

1. Going to your repository's Actions tab
2. Looking for the "Update Daily Programming Meme" workflow
3. Checking the latest run status

## 🐛 Troubleshooting

### Common Issues

1. **No memes appearing**: Check GitHub Actions logs for errors
2. **Permission denied**: Ensure GitHub token has write permissions
3. **API failures**: Normal - the fallback system will handle this

### Debug Mode

Run with debug output:

```bash
DEBUG=true node scripts/update_meme.js
```

## 📝 Contributing

Feel free to:

- Add more meme sources
- Improve error handling
- Add more programming jokes
- Enhance the README integration

## 📄 License

MIT License - feel free to use in your own projects!

## 🎉 Credits

- Programming memes from various public APIs
- Fallback jokes curated from programming community
- Inspired by the awesome GitHub profile README community

---

Happy coding! 🚀 May your commits be clean and your memes be fresh! 😄
