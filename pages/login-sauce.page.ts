import { expect, Locator, Page } from "@playwright/test";

export class Login {
    readonly page: Page;
    readonly logo: Locator
    readonly emailPlaceholder: Locator
    readonly passwordPlaceholder: Locator
    readonly submitButton: Locator
    readonly errorMessage: Locator

    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByText("Swag Labs")
        this.emailPlaceholder = page.getByPlaceholder("Username")
        this.passwordPlaceholder = page.getByPlaceholder("Password")
        this.submitButton = page.getByRole("button", { name: "Login" })
        this.errorMessage = page.getByText("Epic sadface: Username and password do not match any user in this service")
    }

    async visitLandingPage() {
        await this.page.goto("/");
        await expect(this.logo).toBeVisible()
    }

    async loginSuccess(username: string, password: string) {
        await this.emailPlaceholder.fill(username)
        await this.passwordPlaceholder.fill(password)
        await this.submitButton.click()
    }

    async loginFail(username: string, password: string) {
        await this.emailPlaceholder.fill(username)
        await this.passwordPlaceholder.fill(password)
        await this.submitButton.click()
    }
}
