import { expect, Locator, Page } from "@playwright/test";
import { User } from "../types/user.interface";

export class CreateAccount {
    readonly page: Page;
    readonly createAccountPage: Locator
    readonly firstNamePlaceholder: Locator
    readonly lastNamePlaceholder: Locator
    readonly emailPlaceholder: Locator
    readonly phonePlaceholder: Locator
    readonly passwordPlaceholder: Locator
    readonly joinButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.createAccountPage = page.getByTestId("register-page")
        this.firstNamePlaceholder = page.getByTestId("first-name-input")
        this.lastNamePlaceholder = page.getByTestId("last-name-input")
        this.emailPlaceholder = page.getByTestId("email-input")
        this.phonePlaceholder = page.getByTestId("phone-input")
        this.passwordPlaceholder = page.getByTestId("password-input")
        this.joinButton = page.getByTestId("register-button")
    }

    /**
     * Fills out the Create Account form using the provided user data.
     * Using random generated email here because email is unique and cannot be duplicated.
     *
     * @param {User} user - The user details containing first name, last name, phone, and password.
     * @param {string} randomEmail - The generated unique email used for account creation.
     */
    async fillCreateAccountForm(
        user: User, randomEmail: string
    ) {
        await this.firstNamePlaceholder.fill(user.firstName);
        await this.lastNamePlaceholder.fill(user.lastName);
        await this.emailPlaceholder.fill(randomEmail);
        await this.phonePlaceholder.fill(user.phone);
        await this.passwordPlaceholder.fill(user.password);
    }

    async clickJoinButton(
    ) {
        await this.joinButton.click()
    }
}
