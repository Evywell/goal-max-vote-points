const {chromium} = require("playwright-extra");
const {expect} = require("playwright/test");
const stealth = require('puppeteer-extra-plugin-stealth')()

async function launch() {
    const DOMAIN = process.env.DOMAIN;

    chromium.use(stealth);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
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

    await expect(page.getByText('RPG Paradize')).toBeVisible({ timeout: 15_000 });

    const voteBtns = await page
        .locator('vote-vote-site')
        .getByRole('link', { name: 'voter' })
        .all();

    console.log(`Found ${voteBtns.length} vote buttons`);

    await page
        .locator('vote-vote-site')
        .getByRole('link', { name: 'voter' })
        .first()
        .click();

    await page
        .locator('vote-vote-site')
        .getByRole('link', { name: 'voter' })
        .nth(1)
        .click();

    await page
        .locator('vote-vote-site')
        .getByRole('link', { name: 'voter' })
        .last()
        .click();

    await page.screenshot({ path: 'screenshot2.png', fullPage: true });

    await browser.close();
}

launch().then(() => {
    console.log('Done');

    process.exit(0);
}).catch(() => {
    process.exit(0);
});