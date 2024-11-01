const {chromium} = require("playwright");
const {expect} = require("playwright/test");

async function launch() {
    const DOMAIN = process.env.DOMAIN;

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1',
    });
    const page = await context.newPage();

    await page.goto(DOMAIN + '/login');

    console.log('Trying to sign in...');

    const username = process.env.FORM_INPUT_1;
    const password = process.env.FORM_INPUT_2;

    console.log('Using account ' + username);

    await page.getByLabel('Email du compte master').fill(username);
    await page.getByLabel('Mot de passe').fill(password);
    await page.locator('woe-button').click();

    await page.waitForURL(DOMAIN + '/');

    console.log('Sign in successfully !');

    await page.goto(DOMAIN + '/vote');

    await page.screenshot({ path: 'screenshot.png', fullPage: true });

    await expect(page.getByText('RPG Paradize')).toBeVisible();

    const voteBtns = await page
        .locator('vote-vote-site')
        .getByRole('link', { name: 'voter' }).all();

    console.log(`Found ${voteBtns.length} vote buttons`);

    for (const btn of voteBtns) {
        const i = voteBtns.indexOf(btn);
        console.log('Trying to click on ' + i);

        await btn.click();
    }

    await browser.close();
}

launch().then(() => {
    console.log('Done');

    process.exit(0);
}).catch(() => {
    process.exit(0);
});