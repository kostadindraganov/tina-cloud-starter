# Social Media Preview Images

This directory contains images and templates for social media previews (Open Graph and Twitter cards).

## Files

- `og-image.jpg` - Image for Open Graph previews (Facebook, LinkedIn) - 1200×630px
- `twitter-image.jpg` - Image for Twitter card previews - 1200×600px
- `og-image-template.html` - HTML template to help create the OG image
- `twitter-image-template.html` - HTML template to help create the Twitter image
- `og-image-instructions.txt` - Instructions for creating a proper OG image
- `twitter-image-instructions.txt` - Instructions for creating a proper Twitter image

## Creating Images

### Method 1: Using HTML Templates (Recommended)

1. Open the HTML template files in your browser:
   - `og-image-template.html` for Open Graph images
   - `twitter-image-template.html` for Twitter card images

2. Take a screenshot of the container (excluding the instructions)

3. Crop to the appropriate dimensions:
   - 1200×630px for OG images
   - 1200×600px for Twitter images

4. Save the files as `og-image.jpg` and `twitter-image.jpg` respectively

### Method 2: Create Your Own Images

You can also create your own images using any design tool (Photoshop, Figma, Canva, etc.) with these specifications:

- **OG Image**: 1200×630px (minimum), JPG or PNG format
- **Twitter Image**: 1200×600px (minimum), JPG or PNG format

## Regenerating Templates

To regenerate the HTML templates:

```bash
pnpm generate-og
```

To regenerate the static placeholder images:

```bash
pnpm generate-og:static
``` 