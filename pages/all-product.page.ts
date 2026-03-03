import { expect, Locator, Page } from "@playwright/test";

export class AllProduct {
    readonly page: Page;
    readonly storeTitle: Locator
    readonly productList: Locator
    readonly accountButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.storeTitle = page.getByTestId("nav-store-link")
        this.productList = page.getByTestId("products-list")
        this.accountButton = page.getByTestId("nav-account-link")
    }

    /**
     * Navigates to the store landing page and verifies that key UI elements
     * such as the store title and product list are visible.
     */
    async visitLandingPage() {
        await this.page.goto("");
        await expect(this.page).toHaveURL("")
        await expect(this.storeTitle).toBeVisible()
        await expect(this.productList).toBeVisible()
    }

    async clickAccountButton() {
        await this.accountButton.click()
        await expect(this.page).toHaveURL("/us/account")
    }
}
