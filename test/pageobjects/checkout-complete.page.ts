import { ChainablePromiseElement } from 'webdriverio';

class CheckoutStepTwoPage {
  get completeHeader(): ChainablePromiseElement {
    return $("h2.complete-header");
  }

  get backHomeButton(): ChainablePromiseElement {
    return $("#back-to-products");
  }
};

export default new CheckoutStepTwoPage();