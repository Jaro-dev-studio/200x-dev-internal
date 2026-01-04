const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const GIFEncoder = require('gif-encoder-2');
const sharp = require('sharp');

// URLs to capture
const urls = [
  { url: 'https://200x.dev', name: '200x-dev' },
  { url: 'https://realgreatdevs.com', name: 'realgreatdevs' },
  { url: 'https://studio.jaro.dev/business-os', name: 'business-os' },
  { url: 'https://studio.jaro.dev/business-os-lp', name: 'business-os-lp' },
  { url: 'https://pivotalos.com/', name: 'pivotalos' },
  { url: 'https://raisefinancial.com', name: 'raisefinancial' },
  { url: 'https://revivedeadlinks.com', name: 'revivedeadlinks' },
  { url: 'https://read.devthusiast.com', name: 'devthusiast' },
  { url: 'https://qwiklocker.com/', name: 'qwiklocker' },
];

// Configuration
const CONFIG = {
  width: 1280,
  height: 720,
  duration: 5000, // 5 seconds
  frameInterval: 200, // capture every 200ms (5 fps for smaller file size)
  outputDir: path.join(__dirname, '../public/previews'),
};

async function captureGif(browser, urlConfig) {
  const { url, name } = urlConfig;
  console.log(`[GIF Capture] Starting capture for ${name} (${url})...`);
  
  const page = await browser.newPage();
  await page.setViewport({ width: CONFIG.width, height: CONFIG.height });
  
  const frames = [];
  const frameCount = Math.floor(CONFIG.duration / CONFIG.frameInterval);
  
  console.log(`[GIF Capture] Navigating to ${url}...`);
  
  // Start navigation and capture frames simultaneously
  const navigationPromise = page.goto(url, { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  }).catch(err => {
    console.log(`[GIF Capture] Navigation warning for ${name}: ${err.message}`);
  });

  // Start capturing frames immediately
  const startTime = Date.now();
  
  for (let i = 0; i < frameCount; i++) {
    const elapsedTime = Date.now() - startTime;
    const targetTime = i * CONFIG.frameInterval;
    
    // Wait until the target time
    if (elapsedTime < targetTime) {
      await new Promise(resolve => setTimeout(resolve, targetTime - elapsedTime));
    }
    
    try {
      const screenshot = await page.screenshot({ type: 'png' });
      frames.push(screenshot);
      console.log(`[GIF Capture] ${name}: Captured frame ${i + 1}/${frameCount}`);
    } catch (err) {
      console.log(`[GIF Capture] ${name}: Frame ${i + 1} capture failed, skipping...`);
    }
  }
  
  await navigationPromise;
  await page.close();
  
  if (frames.length === 0) {
    throw new Error('No frames captured');
  }
  
  console.log(`[GIF Capture] ${name}: Creating GIF from ${frames.length} frames...`);
  
  // Create GIF encoder
  const encoder = new GIFEncoder(CONFIG.width, CONFIG.height, 'neuquant', true);
  encoder.setDelay(CONFIG.frameInterval);
  encoder.setRepeat(0); // 0 = loop forever
  encoder.setQuality(10);
  encoder.start();
  
  // Add each frame to the GIF
  for (let i = 0; i < frames.length; i++) {
    console.log(`[GIF Capture] ${name}: Processing frame ${i + 1}/${frames.length}...`);
    
    // Convert PNG to raw RGBA pixel data using sharp
    const rawPixels = await sharp(frames[i])
      .ensureAlpha()
      .raw()
      .toBuffer();
    
    encoder.addFrame(rawPixels);
  }
  
  encoder.finish();
  
  // Get the GIF buffer
  const gifBuffer = encoder.out.getData();
  
  // Save to file
  const outputPath = path.join(CONFIG.outputDir, `${name}.gif`);
  fs.writeFileSync(outputPath, gifBuffer);
  
  console.log(`[GIF Capture] ${name}: GIF saved to ${outputPath}`);
  return outputPath;
}

async function main() {
  console.log('[GIF Capture] Starting GIF capture process...');
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`[GIF Capture] Created output directory: ${CONFIG.outputDir}`);
  }
  
  console.log('[GIF Capture] Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const results = [];
  
  for (const urlConfig of urls) {
    try {
      const outputPath = await captureGif(browser, urlConfig);
      results.push({ name: urlConfig.name, success: true, path: outputPath });
    } catch (err) {
      console.error(`[GIF Capture] Error capturing ${urlConfig.name}:`, err.message);
      results.push({ name: urlConfig.name, success: false, error: err.message });
    }
  }
  
  await browser.close();
  
  console.log('\n[GIF Capture] ===== RESULTS =====');
  results.forEach(r => {
    if (r.success) {
      console.log(`  [OK] ${r.name}: ${r.path}`);
    } else {
      console.log(`  [FAIL] ${r.name}: ${r.error}`);
    }
  });
  
  console.log('[GIF Capture] Done!');
}

main().catch(console.error);
