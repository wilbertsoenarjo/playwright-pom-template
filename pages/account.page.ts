import { expect, Locator, Page } from "@playwright/test";
import { User } from "../types/user.interface";

export class Account {
    readonly page: Page;
    readonly accountPage: Locator
    readonly userEmail: Locator
    readonly userName: Locator

    constructor(page: Page) {
        this.page = page;
        this.accountPage = page.getByTestId("account-page")
        this.userEmail = page.getByTestId("customer-email")
        this.userName = page.getByTestId("welcome-message")
    }

    /**
     * Verifies that the account overview page displays the correct user data.
     *
     * Checks:
     * - The user's first name matches the expected value.
     * - The user's email matches the generated email.
     *
     * @param {User} user - The user object containing expected account information.
     * @param {string} email - The expected email shown in the account overview.
     */
    async verifyAccountOverviewData(user: User, email: string) {
        await expect(this.userName).toHaveAttribute("data-value", user.firstName);
        await expect(this.userEmail).toHaveText(email);
    }
}
