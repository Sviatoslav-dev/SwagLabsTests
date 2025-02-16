import { ChainablePromiseElement } from 'webdriverio';

class CartPage {
  get cartItems(): ChainablePromiseArray {
    return $$(".cart_item");
  }

  get checkoutButton(): ChainablePromiseElement {
    return $("button[name='checkout']");
  }

  get errorMessage(): ChainablePromiseElement {  // For case 9, but in reality, the message does not appear
    return $(".error_message");
  }

  async getItemsId(): Promise<string[]> {
    const items = await this.cartItems;
    return items.map(async (item: WebdriverIO.Element) => {
        return await item.$("a").getAttribute('id')
    });
  }

  async getItemPrices(): Promise<string[]> {
    const items = await this.cartItems;
    return items.map(async (item: WebdriverIO.Element) => {
        const itemPriceText = await item.$('.inventory_item_price').getText()
        return itemPriceText.replace('$', '');
    });
  }
}

export default new CartPage();
