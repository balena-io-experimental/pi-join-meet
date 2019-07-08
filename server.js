const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-stealth')());

var path = require('path');
var express = require('express');
var app = express();
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));
app.listen(3000, function () {
	console.log('Listening on http://localhost:3000/');
});

async function sleep(ms) {
	return await new Promise(resolve => setTimeout(resolve, ms));
}

async function getConfig() {
	return {
		executablePath: '/usr/bin/chromium-browser',
		args: [
			'--no-sandbox',
			'--use-fake-ui-for-media-stream',
		]
	}
}

(async () => {
	try {
		const config = await getConfig();
		const browser = await puppeteer.launch(config);
		const page = await browser.newPage();

		const URL = 'https://meet.google.com/rfn-pdbt-wvj';
		console.log(`Joined: ${URL}`);
		await page.goto(URL);

		//await page.waitForNavigation();
		while (true) {
			await page.screenshot({ path: "./public/test.png" });
			await sleep(2000);
		}
	} catch (err) {
		console.error(err);
	}
})();