import { Locator, Page } from "@playwright/test";
import { User } from "../types/user.interface";

export class Login {
    readonly page: Page;
    readonly loginPage: Locator
    readonly joinUsButton: Locator
    readonly emailPlaceholder: Locator
    readonly passwordPlaceholder: Locator
    readonly signInButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.loginPage = page.getByTestId("login-page")
        this.joinUsButton = page.getByTestId("register-button")
        this.emailPlaceholder = page.getByTestId("email-input")
        this.passwordPlaceholder = page.getByTestId("password-input")
        this.signInButton = page.getByTestId("sign-in-button")
    }

    async clickJoinUsButton() {
        await this.joinUsButton.click()
    }

    /**
    * Logs the user into the application using the provided credentials.
    *
    * Steps:
    * - Fills the email input with the user's stored email.
    * - Fills the password input with the user's stored password.
    * - Clicks the sign-in button to submit the login form.
    *
    * @param {User} user - The user object containing email and password.
    */
    async login(user: User) {
        await this.emailPlaceholder.fill(user.email)
        await this.passwordPlaceholder.fill(user.password)
        await this.signInButton.click()
    }
}
