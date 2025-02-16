import { ChainablePromiseElement } from 'webdriverio';

class CheckoutStepTwoPage {
  get cartItems(): ChainablePromiseArray {
    return $$(".cart_item");
  }

  get finishButton(): ChainablePromiseElement {
    return $("#finish");
  }

  async getTotalProductsPrice(): Promise<string> {
    const totalPriceText = await $(".summary_subtotal_label").getText();
    return totalPriceText.replace('Item total: $', '');
  }

  async getItemsId (): Promise<string[]> {
    const items = await this.cartItems;
    return items.map(async (item: WebdriverIO.Element) => {
        return await item.$("a").getAttribute('id')
    });
  }
};

export default new CheckoutStepTwoPage();