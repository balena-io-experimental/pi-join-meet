const puppeteer = require('puppeteer-core');

async function sleep(ms) {
	return await new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
	try {
		const browser = await puppeteer.launch({
			executablePath: '/usr/bin/chromium-browser',
			args: ['--no-sandbox', '--use-fake-ui-for-media-stream']
		});
		const page = await browser.newPage();
		const URL = process.env.MEET_URL || `https://meet.jit.si/${Math.random().toString(36).substring(2)}`;
		console.log(`Joined: ${URL}`);
		await page.goto(URL);
		/* Ensuring Cam and Mic are always On */
		const camSelector = '#new-toolbox > div.toolbox-content > div.button-group-center > div:nth-child(3) > div > div > i';
		const micSelector = '#new-toolbox > div.toolbox-content > div.button-group-center > div:nth-child(1) > div > div > i';
		await page.waitForSelector(camSelector);
		await page.waitForSelector(micSelector);
		while (true) {
			var camClassName = await page.evaluate((s) => {
				return document.querySelector(s).className;
			}, camSelector);
			var micClassName = await page.evaluate((s) => {
				return document.querySelector(s).className;
			}, micSelector);
			if (camClassName === 'icon-camera-disabled toggled') {
				await page.click(camSelector);
			}
			if (micClassName === 'icon-mic-disabled toggled') {
				await page.click(micSelector);
			}
			await sleep(5000);
		}
	} catch (err) {
		console.error(err);
	}
})();