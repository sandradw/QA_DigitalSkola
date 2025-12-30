import { By } from "selenium-webdriver";

class PageProductFilter {
    static appLogo = By.className('app_logo');

    static sortDropdown = By.css('[data-test="product-sort-container"]');
    static sortZtoA = By.css('option[value="za"]');

    static productNames = By.className('inventory_item_name');
}

export default PageProductFilter;