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

// Generate placeholder files with instructions
function generatePlaceholders() {
  // OG Image HTML Template
  const ogHtmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generate OG Image</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: ${config.bgColor};
      color: ${config.textColor};
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      border: 20px solid ${config.accentColor};
      padding: 40px;
      text-align: center;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    h1 {
      font-size: 80px;
      margin-bottom: 20px;
    }
    p {
      font-size: 40px;
    }
    .instructions {
      margin-top: 40px;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.siteName}</h1>
    <p>${config.tagline}</p>
  </div>
  <div class="instructions">
    <h2>Instructions to create OG image:</h2>
    <ol>
      <li>Open this file in a browser</li>
      <li>Take a screenshot of the container (excluding these instructions)</li>
      <li>Crop to 1200×630px</li>
      <li>Save as /public/images/og-image.jpg</li>
    </ol>
  </div>
</body>
</html>`;

  // Twitter Image HTML Template
  const twitterHtmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generate Twitter Image</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: ${config.bgColor};
      color: ${config.textColor};
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      border: 20px solid ${config.accentColor};
      padding: 40px;
      text-align: center;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    h1 {
      font-size: 80px;
      margin-bottom: 20px;
    }
    p {
      font-size: 40px;
    }
    .instructions {
      margin-top: 40px;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.siteName}</h1>
    <p>${config.tagline}</p>
  </div>
  <div class="instructions">
    <h2>Instructions to create Twitter image:</h2>
    <ol>
      <li>Open this file in a browser</li>
      <li>Take a screenshot of the container (excluding these instructions)</li>
      <li>Crop to 1200×600px</li>
      <li>Save as /public/images/twitter-image.jpg</li>
    </ol>
  </div>
</body>
</html>`;

  // Write the HTML templates to disk
  fs.writeFileSync(path.join(imagesDir, 'og-image-template.html'), ogHtmlTemplate);
  fs.writeFileSync(path.join(imagesDir, 'twitter-image-template.html'), twitterHtmlTemplate);

  // Create placeholder JPG files with text instructions
  fs.writeFileSync(path.join(imagesDir, 'og-image.jpg'), 'This is a placeholder. Run the generate-og script and follow the instructions in the HTML files.');
  fs.writeFileSync(path.join(imagesDir, 'twitter-image.jpg'), 'This is a placeholder. Run the generate-og script and follow the instructions in the HTML files.');

  console.log('Generated templates for OG and Twitter images in /public/images/');
  console.log('Open the HTML files in a browser and follow the instructions to create the actual images.');
}

// Run the generation
function run() {
  try {
    generatePlaceholders();
  } catch (error) {
    console.error('Error generating templates:', error);
  }
}

run(); 