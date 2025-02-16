import { ChainablePromiseElement } from 'webdriverio';

class CheckoutStepOnePage {
  get infoForm(): ChainablePromiseElement {
    return $(".checkout_info");
  }

  get firstNameInput(): ChainablePromiseElement {
    return $('#first-name');
  }

  get lastNameInput(): ChainablePromiseElement {
    return $('#last-name');
  }

  get postalCodeInput(): ChainablePromiseElement {
    return $('#postal-code');
  }

  get continueButton(): ChainablePromiseElement {
    return $("#continue");
  }
};

export default new CheckoutStepOnePage();