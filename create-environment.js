const fs = require('fs');
const path = require('path');

// Create environment files dynamically
const environmentProd = {
  production: true,
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN
};

const environmentDev = {
  production: false,
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN
};

// Ensure environments directory exists
const envDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir);
}

// Write environment files
fs.writeFileSync(
  path.join(envDir, 'environment.prod.ts'),
  `export const environment = ${JSON.stringify(environmentProd, null, 2)};`
);

fs.writeFileSync(
  path.join(envDir, 'environment.ts'),
  `export const environment = ${JSON.stringify(environmentDev, null, 2)};`
);
