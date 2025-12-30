import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import fs from 'fs';

import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import PageLogin from '../pages/page_login.js';
import PageProductFilter from '../pages/page_product_filter.js';

describe('SauceDemo Test', function () {
    let driver;
    let options;

    async function login(driver) {
    await driver.get('https://www.saucedemo.com');

    let username = PageLogin.inputUsername;
    let password = PageLogin.inputPassword;
    let loginBtn = PageLogin.buttonLogin;

    // ambil element username
    let usernameEl = await driver.findElement(username);

    // isi username
    await usernameEl.sendKeys('standard_user');

    // SCREENSHOT BAGIAN USERNAME
    let screenshot = await usernameEl.takeScreenshot();
    fs.writeFileSync('./screenshots/username-filled.png',screenshot,'base64');

    // lanjut login
    await driver.findElement(password).sendKeys('secret_sauce');
    await driver.findElement(loginBtn).click();

    await driver.wait(
        until.elementLocated(By.className('inventory_list')),
        10000
    );
    }

    beforeEach(async function () {
        options = new chrome.Options();
        options.addArguments('--incognito');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await login(driver);
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('Cek page title SauceDemo', async function () {
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        // Screenshot setelah login
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync('./screenshots/page_product.png',Buffer.from(screenshot, "base64"));

        //ambil baseline untuk komparasi
        //jika belum ada basleine jadikan page_product.png sebagai baseline
        if (!fs.existsSync('./screenshots/baseline.png')) {
            fs.copyFileSync('./screenshots/page_product.png', './screenshots/baseline.png');
            console.log("Baseline image saved.");
        }

        //compare baseline.png dan page_product.png apakah sama
        let img1 = PNG.sync.read(fs.readFileSync('./screenshots/baseline.png'));
        let img2 = PNG.sync.read(fs.readFileSync('./screenshots/page_product.png'));
        let { width, height } = img1;
        let diff = new PNG ({ width, height });

        let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

        fs. writeFileSync('./screenshots/diff.png', PNG.sync.write(diff));

        if (numDiffPixels > 0){
            console.log(`Visual differences found! Pixels different: ${numDiffPixels}`);
        } else {
            console.log("No Visual differences found.");
        }

    });

    it('Login berhasil dan logo tampil', async function () {
        let logo = PageProductFilter.appLogo;
        let logoText = await driver.findElement(logo).getText();

        assert.strictEqual(logoText, 'Swag Labs');
    });

    it('Sort produk Name (Z to A)', async function () {
        let dropdown = PageProductFilter.sortDropdown;
        let sortZtoA = PageProductFilter.sortZtoA;
        let productNames = PageProductFilter.productNames;

        await driver.findElement(dropdown).click();
        await driver.findElement(sortZtoA).click();
        await driver.sleep(500);

        let elements = await driver.findElements(productNames);

        let actual = [];
        for (let el of elements) {
            actual.push(await el.getText());
        }

        assert.strictEqual(actual[0], 'Test.allTheThings() T-Shirt (Red)');
        assert.strictEqual(actual.at(-1), 'Sauce Labs Backpack');
    });

    it('Login dan cek title (Firefox)', async function () {
        await driver.quit();

        driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options())
            .build();

        await login(driver);

        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');
    });
});