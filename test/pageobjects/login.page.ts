import { ChainablePromiseElement } from 'webdriverio';

class LoginPage {
    get usernameInput(): ChainablePromiseElement {
        return $('#user-name');
    }

    get passwordInput(): ChainablePromiseElement {
        return $('#password');
    }

    get loginButton(): ChainablePromiseElement {
        return $('#login-button');
    }

    get usernameXIcon(): ChainablePromiseElement {
        return $(".form_group:nth-of-type(1) svg");
    }

    get passwordXIcon(): ChainablePromiseElement {
        return $(".form_group:nth-of-type(2) svg");
    }

    get errorMessage(): ChainablePromiseElement {
        return $(".error-message-container h3");
    }

    async isPasswordMasked(): Promise<boolean> {
        const type = await this.passwordInput.getAttribute('type');
        return type === 'password';
    }

    async login(username: string, password: string) {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }
}

export default new LoginPage();