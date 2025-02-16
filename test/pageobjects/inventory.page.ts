import { ChainablePromiseElement } from 'webdriverio';

class InventoryPage {
    get cartIcon(): ChainablePromiseElement {
        return $('.shopping_cart_link');
    }

    get burgerButton(): ChainablePromiseElement {
        return $(".bm-burger-button");
    }

    get menu(): ChainablePromiseElement {
        return $(".bm-menu-wrap");
    }

    get menuItems(): ChainablePromiseArray {
        return $$(".menu-item");
    }

    get shoppingCartBadge(): ChainablePromiseArray {
        return $(".shopping_cart_badge");
    }

    get logoutButton(): ChainablePromiseElement {
        return $("#logout_sidebar_link");
    }

    get cartButton(): ChainablePromiseElement {
        return $(".shopping_cart_link");
    }

    get sortContainer(): ChainablePromiseElement {
        return $(".product_sort_container");
    }

    get Products(): ChainablePromiseArray {
        return $$(".inventory_item");
    }

    get sotialLinks(): Record<string, ChainablePromiseElement> {
        return {
            "twitter": $(".social_twitter a"),
            "facebook": $(".social_facebook a"),
            "linkedin": $(".social_linkedin a"),
        }
    }

    async getProduct(): Promise<{
        id: Promise<string>;
        addToCartButton: ChainablePromiseElement;
        removeFromCartButton: ChainablePromiseElement;
    }> {
        const product = $(".inventory_item");

        return {
          id: product.$(".inventory_item_label a").getAttribute('id'),
          addToCartButton: product.$('button[name="add-to-cart-sauce-labs-backpack"]'),
          removeFromCartButton: product.$('button[name="remove-sauce-labs-backpack"]')
        };
    }

    async getProductNames(): Promise<string[]> {
        const products = await this.Products;
        return products.map(async (product: WebdriverIO.Element) => {
            return await product.$(".inventory_item_description a").getText()
        });
    }

    async getProductPrices(): Promise<number[]> {
        const products = await this.Products;
        return products.map(async (product: WebdriverIO.Element) => {
            const productPriceText = await product.$('.inventory_item_price').getText()
            return parseFloat(productPriceText.replace('$', ''))
        });
    }
}

export default new InventoryPage();
