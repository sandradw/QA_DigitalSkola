const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('Google Search Test', function () {
    let driver;

    it('Visit SauceDemo, Login, cek page title dan dropdown (chrome)', async function () {
        options = new chrome.Options();
        options.addArguments('--incognito'); // option ke chrome supaya gaada popup password nya
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // driver = await new Builder().forBrowser('chrome').build();

        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();

        // assert: memastikan object sama persis
        assert.strictEqual(title, 'Swag Labs');

        // inputs
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()
        
        // tunggu element tampil
        let buttonCart = await driver.wait(
            until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')), 
            10000
        );
        await driver.wait(until.elementIsVisible(buttonCart), 5000, 'Shopping cart harus tampil');
        
        // assert: element ada
        await buttonCart.isDisplayed()

        // assert: text dalam element benar
        let textAppLogo = await driver.findElement(By.className('app_logo'))
        let logotext = await textAppLogo.getText()
        assert.strictEqual(logotext, 'Swag Labs')

        await driver.sleep(1700)

        // pilih dropdown Name (Z to A)
        let dropdownSort = await driver.findElement(
        By.css('[data-test="product-sort-container"]')
        );
        await dropdownSort.sendKeys('Name (Z to A)');

        // ambil semua nama produk
        let productElements = await driver.findElements(
        By.className('inventory_item_name')
        );

        let productNames = [];
        for (let el of productElements) {
        productNames.push(await el.getText());
        }

        // urutan yang seharusnya (Z ke A)
        let sortedNames = [...productNames].sort().reverse();

        // cek urutan sudah benar
        assert.deepStrictEqual(productNames, sortedNames);

        await driver.quit();
    });

    it('Visit SauceDemo (firefox)', async function () {
        options = new chrome.Options();
        options.addArguments("--headless");

        driver = await new Builder().forBrowser('firefox').setChromeOptions(options).build();

        // driver = await new Builder().forBrowser('chrome').build();

        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();

        await driver.quit()


    });

});
