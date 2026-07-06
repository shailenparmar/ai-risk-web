// Screenshot ONLY the web/graph of AI Risk Web (panel + header hidden, refit to full viewport).
import { createRequire } from 'module';
const require = createRequire('/Users/shailen/projects/good-days-mobile-design/package.json');
const puppeteer = require('puppeteer-core');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 1000, deviceScaleFactor: 2 });
await page.goto('http://localhost:8931/local-test.html', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await page.evaluate(() => {
  document.getElementById('panel').style.display = 'none';
  document.querySelector('header').style.display = 'none';
  hoverId = null; selectedId = null;
  // refit to the full viewport using the app's label-aware bbox
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  labelPoints().forEach(([lx, ly]) => { xs.push(lx - 160, lx + 160); ys.push(ly - 45, ly + 45); });
  const x0 = Math.min(...xs) - 40, x1 = Math.max(...xs) + 40;
  const y0 = Math.min(...ys) - 30, y1 = Math.max(...ys) + 40;
  centerX = () => innerWidth / 2;
  centerY = () => innerHeight / 2;
  cam = { x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: Math.min((innerWidth - 40) / (x1 - x0), (innerHeight - 20) / (y1 - y0)) };
  camT = null; draw();
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: '/Users/shailen/projects/shailenparmar.com/public/design/ai-risk-web.png', type: 'png' });
await browser.close();
console.log('captured web-only');
