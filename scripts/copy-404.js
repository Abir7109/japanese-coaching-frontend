const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');
const notFoundPath = path.join(buildDir, '404.html');

try {
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('Copied index.html to 404.html for GitHub Pages fallback.');
  } else {
    console.warn('index.html not found; skipping 404.html copy.');
  }
} catch (err) {
  console.error('Failed to create 404.html:', err);
  process.exit(0); // do not fail the build
}
