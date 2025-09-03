# 🚀 Interactive GitHub Rocket

This project now includes an **interactive rocket** that follows your cursor and displays your actual GitHub contribution data!

## ✨ Features

- **🖱️ Cursor-Following Rocket**: The rocket follows your mouse cursor as you move it around
- **📊 Real GitHub Data**: Uses your actual contribution graph (or realistic simulation)
- **🎮 Interactive Elements**: Hover over contribution cells to see details
- **🌟 Space Theme**: Beautiful nebula backgrounds and twinkling stars
- **🔥 Smooth Animations**: Rocket fire effects and particle systems
- **📈 Live Stats**: Shows your contribution stats, streaks, and achievements

## 🛠️ Available Scripts

Run these commands in your terminal:

```bash
# Generate basic rocket SVG
npm run generate-rocket

# Generate interactive rocket SVG with hover effects
npm run generate-interactive-rocket

# Generate advanced interactive HTML version
npm run generate-advanced-rocket

# Fetch real GitHub contribution data (requires token)
npm run fetch-github-data
```

## 🎯 How to Use

### Option 1: Interactive HTML Version (Recommended)

1. Run `npm run generate-advanced-rocket`
2. Open `interactive-rocket-advanced.html` in your browser
3. Move your cursor around to control the rocket!
4. Hover over contribution squares for details
5. Click on contribution squares for celebration effects ✨

### Option 2: Enhanced SVG for GitHub README

1. Run `npm run generate-interactive-rocket`
2. The enhanced `assets/rocket.svg` will include cursor-following features
3. Use it in your GitHub README as usual

## 🔑 Using Real GitHub Data

To use your actual GitHub contribution data instead of simulated data:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Create a new token with `read:user` scope
3. Create a `.env` file in your project root:
   ```
   GITHUB_TOKEN=your_token_here
   ```
4. Run `npm run fetch-github-data`
5. Then run `npm run generate-advanced-rocket`

## 🎨 Customization

### Modifying the Rocket

- Edit colors in the gradient definitions
- Adjust rocket size by changing the polygon and rect dimensions
- Customize fire effects in the `generateInteractiveRocket()` function

### Changing Contribution Graph

- Modify `generateContributionGraph()` to change cell colors
- Adjust `cellSize` and `cellSpacing` for different layouts
- Change contribution level thresholds in `getContributionLevel()`

### Adding New Features

- Mouse click events for special effects
- Keyboard controls for rocket movement
- Different rocket designs for different contribution levels
- Sound effects (requires additional setup)

## 🎮 Interactive Features

### Mouse Controls

- **Move**: Rocket follows your cursor with smooth trailing
- **Hover**: Contribution cells light up and show tooltips
- **Click**: Celebration effects with sparkles ✨

### Auto Features

- **Idle Mode**: Rocket returns to auto-flight when cursor is inactive
- **Twinkling Stars**: Randomly animated background stars
- **Nebula Rotation**: Slowly rotating space nebulae
- **Fire Particles**: Dynamic rocket exhaust effects

## 🚀 Tips for Best Experience

1. **Full Screen**: Use F11 or full screen mode for best immersion
2. **Dark Mode**: The space theme looks best in dark environments
3. **Modern Browser**: Use Chrome, Firefox, or Edge for best performance
4. **GPU Acceleration**: Enable hardware acceleration for smooth animations

## 🔧 Troubleshooting

### Rocket Not Following Cursor

- Make sure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

### Contribution Data Not Loading

- Verify your GitHub token permissions
- Check your internet connection
- The script will fall back to realistic simulated data

### Performance Issues

- Try reducing the number of stars in `generateStars()`
- Disable some animation effects for older devices
- Close other browser tabs for better performance

## 📱 Mobile Support

The interactive rocket works on mobile devices too:

- **Touch**: Tap and drag to move the rocket
- **Responsive**: Automatically adjusts to screen size
- **Touch Tooltips**: Tap contribution cells for details

Enjoy your interactive GitHub rocket! 🚀✨
