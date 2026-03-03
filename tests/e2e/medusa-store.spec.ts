import { test, expect } from "@playwright/test";
import { AllProduct } from "../../pages/all-product.page";
import { SortBy } from "../../utils/component/sort-by.component";
import { Login } from "../../pages/login.page";
import { CreateAccount } from "../../pages/create-account.page";
import { medusaUsers as users } from "../../fixtures/data/medusa-user.data";
import { Account } from "../../pages/account.page";

const createUser = users["Create user"]
const loginUser = users["Login user"]

test.beforeEach(async ({ page }) => {
    const allProduct = new AllProduct(page)

    await allProduct.visitLandingPage()
});

test.describe("E2E Test", () => {
    test("Should be able to sort price by highest to lowest", async ({ page }) => {
        const sortBy = new SortBy(page)

        await sortBy.sortPrice("Price: High -> Low")
    });

    test("Should be able to sort price by lowest to highest", async ({ page }) => {
        const sortBy = new SortBy(page)

        await sortBy.sortPrice("Price: Low -> High")
    });

    test("Should be able to create an account", async ({ page }) => {
        const allProduct = new AllProduct(page)
        const login = new Login(page)
        const createAccount = new CreateAccount(page)
        const account = new Account(page)
        const randomEmail = `${Date.now()}@gmail.com`;

        await allProduct.clickAccountButton()
        await expect(login.loginPage).toBeVisible()

        await login.clickJoinUsButton()
        await expect(createAccount.createAccountPage).toBeVisible()

        await createAccount.fillCreateAccountForm(createUser, randomEmail)
        await createAccount.clickJoinButton()
        await expect(account.accountPage).toBeVisible()
        await account.verifyAccountOverviewData(createUser, randomEmail)
    });

    test("Should be able to login", async ({ page }) => {
        const allProduct = new AllProduct(page)
        const login = new Login(page)
        const account = new Account(page)

        await allProduct.clickAccountButton()
        await expect(login.loginPage).toBeVisible()

        await login.login(loginUser)
        await account.verifyAccountOverviewData(loginUser, loginUser.email)
    });
})