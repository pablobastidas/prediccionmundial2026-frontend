const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

const ROUTES = [
  // Public routes
  { name: '01-landing', path: '/', authRequired: false },
  { name: '02-login', path: '/login', authRequired: false },
  { name: '03-register', path: '/register', authRequired: false },
  { name: '04-simulator-public', path: '/simulator-public', authRequired: false },
  
  // Protected routes (captured after login)
  { name: '05-home', path: '/home', authRequired: true },
  { name: '06-predictions', path: '/predictions', authRequired: true },
  { name: '07-profile', path: '/me', authRequired: true },
  { name: '08-leagues', path: '/leagues', authRequired: true },
  { name: '09-explore-leagues', path: '/explore-leagues', authRequired: true },
  { name: '10-create-league', path: '/create-league', authRequired: true },
  { name: '11-join-league', path: '/join-league', authRequired: true },
  { name: '12-simulator', path: '/simulator', authRequired: true }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'mobile', width: 375, height: 812, isMobile: true }
];

// Helper to check if server is listening on port 3000
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.end();
  });
}

// Helper to sleep/wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('--- PLAYWRIGHT SCREENSHOT GENERATOR ---');
  
  // 1. Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.log(`Creating directory: ${SCREENSHOTS_DIR}`);
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // 2. Check if server is running
  let isRunning = await checkServer();
  let devServerProcess = null;

  if (!isRunning) {
    console.log(`Next.js server not detected on ${BASE_URL}. Starting dev server...`);
    devServerProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      shell: true,
      stdio: 'inherit'
    });

    // Poll server until responsive (up to 30 seconds)
    let attempts = 0;
    const maxAttempts = 60; // 60 * 500ms = 30 seconds
    while (attempts < maxAttempts) {
      await sleep(500);
      isRunning = await checkServer();
      if (isRunning) {
        console.log('Next.js dev server started successfully.');
        break;
      }
      attempts++;
    }

    if (!isRunning) {
      console.error('Failed to start Next.js dev server. Please start it manually and try again.');
      if (devServerProcess) devServerProcess.kill();
      process.exit(1);
    }
  } else {
    console.log(`Next.js server is already running on ${BASE_URL}.`);
  }

  // Give the server an extra second to compile files if it just started
  await sleep(2000);

  // 3. Launch browser
  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n--- Capturing screenshots for viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
      
      // Create new context for each viewport
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile,
        userAgent: vp.isMobile 
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
          : undefined
      });

      const page = await context.newPage();

      // Navigate and screenshot public routes first
      for (const route of ROUTES.filter(r => !r.authRequired)) {
        const url = `${BASE_URL}${route.path}`;
        console.log(`Visiting public route [${route.name}]: ${url}`);
        
        try {
          await page.goto(url, { waitUntil: 'load', timeout: 15000 });
          // Wait to allow client-side hydration and animations to finish
          await page.waitForTimeout(2000);
          
          const filepath = path.join(SCREENSHOTS_DIR, `${route.name}-${vp.name}.png`);
          await page.screenshot({ path: filepath, fullPage: true });
          console.log(`Saved screenshot: ${filepath}`);
        } catch (e) {
          console.error(`Error capturing ${route.path}:`, e.message);
        }
      }

      // Perform Mock Login
      console.log('Performing login on /login page to set authentication session...');
      try {
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'load', timeout: 15000 });
        await page.waitForSelector('#email', { timeout: 5000 });
        
        await page.fill('#email', 'test@example.com');
        await page.fill('#password', 'password123');
        
        console.log('Submitting login form...');
        await Promise.all([
          page.click('button[type="submit"]'),
          page.waitForURL(`${BASE_URL}/home`, { timeout: 10000 })
        ]);
        
        console.log('Login successful! Redirected to /home.');
        await page.waitForTimeout(2000); // Wait for home page dashboard to render
      } catch (e) {
        console.error('Failed to log in. Protected routes will be skipped for this viewport.', e.message);
        await context.close();
        continue;
      }

      // Navigate and screenshot protected routes
      for (const route of ROUTES.filter(r => r.authRequired)) {
        const url = `${BASE_URL}${route.path}`;
        console.log(`Visiting protected route [${route.name}]: ${url}`);
        
        try {
          await page.goto(url, { waitUntil: 'load', timeout: 15000 });
          await page.waitForTimeout(2000);
          
          const filepath = path.join(SCREENSHOTS_DIR, `${route.name}-${vp.name}.png`);
          await page.screenshot({ path: filepath, fullPage: true });
          console.log(`Saved screenshot: ${filepath}`);
        } catch (e) {
          console.error(`Error capturing protected route ${route.path}:`, e.message);
        }
      }

      await context.close();
    }
  } catch (err) {
    console.error('An unexpected error occurred during execution:', err);
  } finally {
    console.log('Closing browser...');
    await browser.close();
    
    if (devServerProcess) {
      console.log('Stopping Next.js dev server...');
      devServerProcess.kill();
    }
    
    console.log('\nAll done! Check the "screenshots" folder in the project root.');
  }
}

main();
