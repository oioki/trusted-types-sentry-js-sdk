import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';

import puppeteer from 'puppeteer-core';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:4173/';

const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
  env: process.env,
  stdio: 'ignore',
});

try {
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(URL);
      break;
    } catch {
      await sleep(200);
    }
  }

  const browser = await puppeteer.launch({executablePath: CHROME, headless: true});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const reports = [];
  page.on('response', response => {
    if (response.url().includes('/security/')) {
      reports.push(response.status());
    }
  });

  await page.goto(URL, {waitUntil: 'networkidle0'});
  await sleep(1000);
  for (const id of ['report-dialog', 'lazy-load', 'feedback']) {
    await page.$eval(`#${id}`, button => button.click());
    await sleep(1500);
  }

  const violations = await page.evaluate(() => window.__violations ?? []);
  const feedbackRendered = await page.evaluate(
    () => !!document.querySelector('#sentry-feedback')?.shadowRoot?.querySelector('form')
  );
  console.log(`mode: ${process.env.TT_MODE === 'enforce' ? 'enforce' : 'report-only'}`);
  console.log(`${violations.length} violations`);
  console.log(`feedback form rendered: ${feedbackRendered}`);
  console.log(`reports sent to Sentry: ${reports.length} (statuses: ${reports.join(', ')})`);
  console.table(violations.map(({sink, sample, source}) => ({sink, sample, source})));
  if (errors.length) {
    console.log('page errors:');
    errors.forEach(error => console.log(`  ${error}`));
  }

  await browser.close();
} finally {
  server.kill();
}
