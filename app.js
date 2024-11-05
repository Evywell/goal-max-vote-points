const {chromium} = require("playwright-extra");
const stealth = require('puppeteer-extra-plugin-stealth')()

async function launch() {
    const DOMAIN = process.env.DOMAIN;
    const API_DOMAIN = process.env.API_DOMAIN;
    const ACCOUNT_ID = process.env.ACCOUNT_ID;

    chromium.use(stealth);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const request = await context.request;

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

    const storage = await page.context().storageState();
    const accessTokenStorage = storage.origins[0].localStorage.find((el) => el['name'] === 'access_token');

    await page.screenshot({ path: 'screenshot.png', fullPage: true });

    console.log(accessTokenStorage.value.length);

    const vote1Response = await request.post(API_DOMAIN + '/api/web/votes', {
        headers: {
            'Authorization': 'Bearer ' + accessTokenStorage.value,
            'Content-Type': 'application/json'
        },
        data: {
            "id": {
                "account": ACCOUNT_ID,
                "site": 5
            },
            "account_id": ACCOUNT_ID,
            "site_id": 5,
            "validate": false,
            "captcha": null,
            "site": {
                "id": 5,
                "name": "Gowonda",
                "url": "https://www.gowonda.com/vote.php?server_id=6402",
                "image": "gowonda",
                "cooldown": 120,
                "server": "NONE"
            },
            "expired": true
        }
    });

    const vote2Response = await request.post(API_DOMAIN + '/api/web/votes', {
        headers: {
            'Authorization': 'Bearer ' + accessTokenStorage.value,
            'Content-Type': 'application/json'
        },
        data: {
            "id": {
                "account": ACCOUNT_ID,
                "site": 2
            },
            "account_id": ACCOUNT_ID,
            "site_id": 2,
            "validate": false,
            "captcha": null,
            "site": {
                "id": 2,
                "name": "RPG Paradize",
                "url": "https://www.rpg-paradize.com/?page=vote&vote=3950",
                "image": "rpg",
                "cooldown": 120,
                "server": "NONE"
            },
            "expired": true
        }
    });

    const vote3Response = await request.post(API_DOMAIN + '/api/web/votes', {
        headers: {
            'Authorization': 'Bearer ' + accessTokenStorage.value,
            'Content-Type': 'application/json'
        },
        data: {
            "id": {
                "account": ACCOUNT_ID,
                "site": 1
            },
            "account_id": ACCOUNT_ID,
            "site_id": 1,
            "validate": false,
            "captcha": null,
            "site": {
                "id": 2,
                "name": "Serveur Privé",
                "url": "https://serveur-prive.net/world-of-warcraft/way-of-elendil-wotlk-3-3-5-178/vote",
                "image": "serveur-prive",
                "cooldown": 90,
                "server": "NONE"
            },
            "expired": true
        }
    });

    console.log(vote1Response.status(), vote2Response.status(), vote3Response.status());

    await browser.close();
}

launch().then(() => {
    console.log('Done');

    process.exit(0);
}).catch(() => {
    process.exit(0);
});