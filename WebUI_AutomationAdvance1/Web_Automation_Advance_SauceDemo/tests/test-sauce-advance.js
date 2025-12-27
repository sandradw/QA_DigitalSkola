const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

describe('SauceDemo Test', function () {
    let driver;
    let options;

        async function login(driver) {
        await driver.get('https://www.saucedemo.com');

        await driver.findElement(By.css('[data-test="username"]'))
            .sendKeys('standard_user');
        await driver.findElement(By.css('[data-test="password"]'))
            .sendKeys('secret_sauce');
        await driver.findElement(By.css('[data-test="login-button"]'))
            .click();

        await driver.wait(
            until.elementLocated(By.className('inventory_list')),
            10000
        );
    }

    // DIJALANKAN SEBELUM SETIAP it
    beforeEach(async function () {
        options = new chrome.Options();
        options.addArguments('--incognito');

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await login(driver);
    });

    // DIJALANKAN SETELAH SETIAP it
    afterEach(async function () {
        await driver.quit();
    });

    it('Cek page title SauceDemo', async function () {
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');
    });

    it('Login berhasil dan logo tampil', async function () {
        let logo = await driver.findElement(By.className('app_logo'));
        let logoText = await logo.getText();

        assert.strictEqual(logoText, 'Swag Labs');
    });

    it('Sort produk Name (Z to A)', async function () {

    let dropdownSort = await driver.findElement(
        By.css('[data-test="product-sort-container"]')
    );

    await dropdownSort.click();
    await driver.findElement(By.css('option[value="za"]')).click();

    await driver.sleep(500);

    let elements = await driver.findElements(
        By.className('inventory_item_name')
    );

    let actual = [];
    for (let el of elements) {
        actual.push(await el.getText());
    }

    // ASSERTION JELAS Z → A
    assert.strictEqual(actual[0],'Test.allTheThings() T-Shirt (Red)');
    assert.strictEqual(actual.at(-1),'Sauce Labs Backpack');
    });


    // TEST FIREFOX
    it('Login dan cek title (Firefox)', async function () {
        await driver.quit(); // tutup Chrome

        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options()).build();

        await login(driver);

        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');
    });
});