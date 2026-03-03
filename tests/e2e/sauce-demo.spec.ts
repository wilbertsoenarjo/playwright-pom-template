import { test, expect } from "@playwright/test";
import { Login } from "../../pages/login-sauce.page";
import { sauceDemoUsers as users } from "../../fixtures/data/sauce-demo-user.data";

const loginUser = users["Login user sauce"]
const loginFailUser = users["Login user sauce fail"]

let login: Login

test.beforeEach(async ({ page }) => {
    login = new Login(page)
    await login.visitLandingPage()
});

test.describe("E2E Test", () => {
    test("Should be able to login", async ({ page }) => {
        await login.loginSuccess(loginUser.email, loginUser.password)
        await expect(page).toHaveURL(/inventory/)
    });

    test("Should not be able to login using wrong password", async () => {
        await login.loginFail(loginFailUser.email, loginFailUser.password)
        await expect(login.errorMessage).toBeVisible()
    });
})
