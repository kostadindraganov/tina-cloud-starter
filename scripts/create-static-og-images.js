const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configuration
const config = {
  siteName: 'TinaApp',
  tagline: 'A Next.js site powered by TinaCMS',
  bgColor: '#ffffff',
  textColor: '#000000',
  accentColor: '#2563eb',
};

// Create a 1x1 pixel transparent PNG for base64 encoding
// This is just a minimal valid PNG image
const transparentPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// Generate static image files with text
function generateStaticImages() {
  // Create a simple text file with instructions
  const ogImageTxt = `
This is a static placeholder for the OG image.

Site: ${config.siteName}
Tagline: ${config.tagline}

To create a proper image:
1. Run 'pnpm generate-og'
2. Open the HTML template in a browser
3. Take a screenshot and save it as og-image.jpg
`;

  const twitterImageTxt = `
This is a static placeholder for the Twitter image.

Site: ${config.siteName}
Tagline: ${config.tagline}

To create a proper image:
1. Run 'pnpm generate-og'
2. Open the HTML template in a browser
3. Take a screenshot and save it as twitter-image.jpg
`;

  // Write the transparent PNG as placeholders 
  // (this will be a properly formatted image file so it won't break anything)
  const imageBuffer = Buffer.from(transparentPixelBase64, 'base64');
  fs.writeFileSync(path.join(imagesDir, 'og-image.jpg'), imageBuffer);
  fs.writeFileSync(path.join(imagesDir, 'twitter-image.jpg'), imageBuffer);
  
  // Also create text files with instructions
  fs.writeFileSync(path.join(imagesDir, 'og-image-instructions.txt'), ogImageTxt);
  fs.writeFileSync(path.join(imagesDir, 'twitter-image-instructions.txt'), twitterImageTxt);

  console.log('Created static placeholder images in /public/images/');
  console.log('These are minimal 1x1 transparent PNG files to prevent errors.');
  console.log('To create proper images, follow the instructions in the text files.');
}

// Run the generation
function run() {
  try {
    generateStaticImages();
  } catch (error) {
    console.error('Error generating static images:', error);
  }
}

run(); 