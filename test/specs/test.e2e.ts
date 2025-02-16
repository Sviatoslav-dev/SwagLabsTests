import LoginPage from '../pageobjects/login.page';
import InventoryPage from '../pageobjects/inventory.page';
import CartPage from '../pageobjects/cart.page';
import CheckoutStepTwoPage from '../pageobjects/checkout-step-two.page';
import CheckoutCompletePage from '../pageobjects/checkout-complete.page';
import CheckoutStepOnePage from '../pageobjects/checkout-step-one.page';
import { URLS } from '../utils/urls';

describe('Swag Labs Tests', () => {
    beforeEach(async () => {
        await browser.reloadSession();
        await browser.url(URLS.BASE);
    });

    it('Valid Login', async () => {
        const username = "standard_user";
        await LoginPage.usernameInput.setValue(username);
        expect(await LoginPage.usernameInput.getValue() == username).toBeTruthy();
        
        await LoginPage.passwordInput.setValue('secret_sauce');
        expect(await LoginPage.isPasswordMasked()).toBeTruthy();
        
        await LoginPage.loginButton.click();
        expect(await browser.getUrl()).toBe(URLS.INVENTORY);
        const products = await InventoryPage.Products
        await expect(products.length > 0).toBeTruthy();
        await expect(InventoryPage.cartIcon).toBeDisplayed();
    });

    it('Login with invalid password', async () => {
        const username = "standard_user";
        await LoginPage.usernameInput.setValue(username);
        expect(await LoginPage.usernameInput.getValue() == username).toBeTruthy();

        await LoginPage.passwordInput.setValue('incorrect_password');
        expect(await LoginPage.isPasswordMasked()).toBeTruthy();

        await LoginPage.loginButton.click();

        await expect(LoginPage.usernameXIcon).toBeDisplayed();
        await expect(LoginPage.passwordXIcon).toBeDisplayed();
        await expect(LoginPage.errorMessage).toBeDisplayed();
        expect(await LoginPage.errorMessage.getText()).toBe(
            "Epic sadface: Username and password do not match any user in this service"
        );
        expect((await LoginPage.usernameInput.getAttribute("class")).split(" ")).toContain("error");
        expect((await LoginPage.passwordInput.getAttribute("class")).split(" ")).toContain("error");
    });

    it('Login with invalid login', async () => {
        const username = "incorrect_username";
        await LoginPage.usernameInput.setValue(username);
        expect(await LoginPage.usernameInput.getValue() == username).toBeTruthy();

        await LoginPage.passwordInput.setValue('secret_sauce');
        expect(await LoginPage.isPasswordMasked()).toBeTruthy();

        await LoginPage.loginButton.click();

        await expect(LoginPage.usernameXIcon).toBeDisplayed();
        await expect(LoginPage.passwordXIcon).toBeDisplayed();
        await expect(LoginPage.errorMessage).toBeDisplayed();
        expect(await LoginPage.errorMessage.getText()).toBe(
            "Epic sadface: Username and password do not match any user in this service"
        );
        expect((await LoginPage.usernameInput.getAttribute("class")).split(" ")).toContain("error");
        expect((await LoginPage.passwordInput.getAttribute("class")).split(" ")).toContain("error");
    });

    it('Logout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');
        await InventoryPage.burgerButton.click();
        await expect(InventoryPage.menu).toBeDisplayedInViewport();

        for (const item of (await InventoryPage.menuItems)) {
            await expect(item).toBeDisplayedInViewport();
        }

        await InventoryPage.logoutButton.click();
        expect(await browser.getUrl()).toBe(URLS.BASE);
        expect(await LoginPage.usernameInput.getValue()).toBe("");
        expect(await LoginPage.passwordInput.getValue()).toBe("");
    });

    it('Saving the card after logout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');
        const product = await InventoryPage.getProduct();
        const productId = await product.id;
        await product.addToCartButton.click();
        expect(await InventoryPage.shoppingCartBadge.getText()).toBe("1");
        await expect(product.removeFromCartButton).toBeDisplayed();
        
        await InventoryPage.burgerButton.click();
        await expect(InventoryPage.menu).toBeDisplayedInViewport();
        for (const item of (await InventoryPage.menuItems)) {
            await expect(item).toBeDisplayedInViewport();
        }

        await InventoryPage.logoutButton.click();
        expect(await browser.getUrl()).toBe(URLS.BASE);
        expect(await LoginPage.usernameInput.getValue()).toBe("");
        expect(await LoginPage.passwordInput.getValue()).toBe("");

        await LoginPage.login('standard_user', 'secret_sauce');
        const products = await InventoryPage.Products
        expect(products.length > 0).toBeTruthy();
        await expect(InventoryPage.cartIcon).toBeDisplayed();

        await InventoryPage.cartButton.click()
        expect(await browser.getUrl()).toBe(URLS.CART);

        const cartItems = await CartPage.cartItems;
        await expect(cartItems).toHaveLength(1);
        const itemsId = await CartPage.getItemsId();
        expect(itemsId[0]).toBe(productId);
    });

    it('Sorting', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');

        let values, sortedValues;

        await InventoryPage.sortContainer.selectByVisibleText("Name (A to Z)");
        values = await InventoryPage.getProductNames();
        sortedValues = [...values].sort();
        expect(values).toEqual(sortedValues);

        await InventoryPage.sortContainer.selectByVisibleText("Name (Z to A)");
        values = await InventoryPage.getProductNames();
        sortedValues = [...values].sort().reverse();
        expect(values).toEqual(sortedValues);

        await InventoryPage.sortContainer.selectByVisibleText("Price (low to high)");
        values = await InventoryPage.getProductPrices();
        sortedValues = [...values].sort((a, b) => a - b);
        expect(values).toEqual(sortedValues);

        await InventoryPage.sortContainer.selectByVisibleText("Price (high to low)");
        values = await InventoryPage.getProductPrices();
        sortedValues = [...values].sort((a, b) => a - b).reverse();
        expect(values).toEqual(sortedValues);
    });

    it('Footer Links', async () => {
        const footerLinks = [
            { social: 'twitter', expectedUrl: 'https://x.com/saucelabs' },
            { social: 'facebook', expectedUrl: 'https://www.facebook.com/saucelabs' },
            { social: 'linkedin', expectedUrl: 'https://www.linkedin.com/company/sauce-labs/' }
        ];


        await LoginPage.login('standard_user', 'secret_sauce');
        for (const { social, expectedUrl } of footerLinks) {
            const mainWindow = await browser.getWindowHandle();
            await InventoryPage.sotialLinks[social].click();

            const windows = await browser.getWindowHandles();
            const newWindow = windows.find(win => win !== mainWindow);
            if (!newWindow) throw new Error('New tab did not open');
            await browser.switchToWindow(newWindow);

            expect(await browser.getUrl()).toContain(expectedUrl);

            await browser.closeWindow();
            await browser.switchToWindow(mainWindow);
        };
    });

    it('Valid Checkout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');

        const product = await InventoryPage.getProduct();
        const productId = await product.id;
        await product.addToCartButton.click();
        expect(await InventoryPage.shoppingCartBadge.getText()).toBe("1");
        await expect(product.removeFromCartButton).toBeDisplayed();

        await InventoryPage.cartButton.click();
        expect(await browser.getUrl()).toBe(URLS.CART);
        const cartItems = await CartPage.cartItems;
        await expect(cartItems).toHaveLength(1);
        const itemsId = await CartPage.getItemsId()
        expect(itemsId[0]).toBe(productId);

        await CartPage.checkoutButton.click();
        await expect(CheckoutStepOnePage.infoForm).toBeDisplayed();

        await CheckoutStepOnePage.firstNameInput.setValue("First Name");
        expect(await CheckoutStepOnePage.firstNameInput.getValue()).toBe("First Name");

        await CheckoutStepOnePage.lastNameInput.setValue("Last Name");
        expect(await CheckoutStepOnePage.lastNameInput.getValue()).toBe("Last Name");

        await CheckoutStepOnePage.postalCodeInput.setValue("12345");
        expect(await CheckoutStepOnePage.postalCodeInput.getValue()).toBe("12345");

        await CheckoutStepOnePage.continueButton.click();
        expect(await browser.getUrl()).toBe(URLS.CHECKOUT_STEP_TWO);

        const checkoutCartItems = await CheckoutStepTwoPage.cartItems;
        await expect(checkoutCartItems).toHaveLength(1);
        const checkoutItemsId = await CheckoutStepTwoPage.getItemsId();
        expect(checkoutItemsId[0]).toBe(productId);
        const itemPrices = await CartPage.getItemPrices()
        expect(await CheckoutStepTwoPage.getTotalProductsPrice()).toBe(itemPrices[0]);

        await CheckoutStepTwoPage.finishButton.click();
        expect(await browser.getUrl()).toBe(URLS.CHECKOUT_COMPLETE);
        await expect(CheckoutCompletePage.completeHeader).toBeDisplayed();

        await CheckoutCompletePage.backHomeButton.click();
        expect(await browser.getUrl()).toBe(URLS.INVENTORY);
        const products = await InventoryPage.Products
        expect(products.length > 0).toBeTruthy();
        expect(await InventoryPage.shoppingCartBadge.isDisplayed()).toBe(false);
    });

    it('Checkout without products', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');

        await InventoryPage.cartButton.click()
        expect(await browser.getUrl()).toBe(URLS.CART);

        const cartItems = await CartPage.cartItems;
        await expect(cartItems).toHaveLength(0);

        await CartPage.checkoutButton.click();

        // The test case specifies checking whether an error message appears, 
        // but it does not show up on the website, so this will be a failure.
        await expect(CartPage.errorMessage).toBeDisplayed();
    });
});
