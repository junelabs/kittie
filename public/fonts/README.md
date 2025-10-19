# Font Files Setup

## Current Status: 📁 STORED (Not Active)
Your custom fonts are stored here but not currently active. The site is using system fonts.

## Stored Font Files:
- `Quilon-Medium.woff2` 📁
- `Quilon-Medium.woff` 📁
- `Quilon-Medium.ttf` 📁
- `Rowan-Regular.woff2` 📁
- `Rowan-Regular.woff` 📁
- `Rowan-Regular.ttf` 📁

## Current Font Stack:
- **Headings & Body**: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, etc.)

## To Re-activate Custom Fonts:
If you want to use these fonts again, the CSS is ready to be uncommented in `app/globals.css`. The font declarations are commented out but can be easily restored.

## Additional Weights Available:
If you want more font weight variety, you can add:

### Quilon (Headings) - Additional Weights:
- `Quilon-Regular.woff2` (for lighter headings)
- `Quilon-SemiBold.woff2` (for bolder headings)
- `Quilon-Bold.woff2` (for very bold headings)

### Rowan (Body Text) - Additional Weights:
- `Rowan-Medium.woff2` (for medium weight text)
- `Rowan-SemiBold.woff2` (for semi-bold text)

## File Format Priority:
1. `.woff2` (best compression, modern browsers)
2. `.woff` (fallback for older browsers)
3. `.ttf` (universal fallback)

## How to Add Fonts:
1. Copy your font files from the Fontshare kit
2. Rename them to match the naming convention above
3. Place them in this `/public/fonts/` directory
4. Restart your development server (`npm run dev`)

## Font Usage:
- **Headings (h1, h2, h3, h4, h5, h6)**: Automatically use Quilon
- **Body text**: Automatically use Rowan
- **Utility classes**: Use `.font-heading` or `.font-body` for specific elements

The fonts are already configured in `app/globals.css` and will load automatically once the files are in place.
