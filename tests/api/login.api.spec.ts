import { test, expect, type APIResponse } from "@playwright/test";
import Ajv from "ajv";
import { reqResUsers as users } from "../../fixtures/data/reqres-user.data";
import { loginSchema, loginErrorSchema } from "../../fixtures/schemas/login.schema";

const user = users["Standard user"];
const apiKey = "";

const ajv = new Ajv();
const validateLoginSuccess = ajv.compile(loginSchema);
const validateLoginError = ajv.compile(loginErrorSchema);

test.describe("Login", () => {
    test.describe("Positive - valid credentials", () => {
        let response: APIResponse;
        let responseBody: Record<string, unknown>;

        test.beforeEach(async ({ request }) => {
            response = await request.post("/api/login", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    email: user.email,
                    password: user.password,
                },
            });
            responseBody = await response.json();
        });

        test("Should be able to login", async () => {
            expect(response.status()).toBe(200);
            expect(responseBody.token).toBeTruthy();
        });

        test("Should validate success response schema", async () => {
            expect(response.status()).toBe(200);
            const valid = validateLoginSuccess(responseBody);
            if (!valid) console.error(validateLoginSuccess.errors);
            expect(valid).toBe(true);
        });
    });

    test.describe("Negative - invalid credentials", () => {
        test("Should not be able to login using wrong password", async ({ request }) => {
            const response = await request.post("/api/login", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    email: user.email,
                    password: "wrongpassword",
                },
            });
            const responseBody = await response.json();

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBeTruthy();
        });

        test("Should return error when password is missing", async ({ request }) => {
            const response = await request.post("/api/login", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    email: user.email,
                },
            });
            const responseBody = await response.json();

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBe("Missing password");
            const valid = validateLoginError(responseBody);
            if (!valid) console.error(validateLoginError.errors);
            expect(valid).toBe(true);
        });

        test("Should return error when email is missing", async ({ request }) => {
            const response = await request.post("/api/login", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    password: user.password,
                },
            });
            const responseBody = await response.json();

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBe("Missing email address");
            const valid = validateLoginError(responseBody);
            if (!valid) console.error(validateLoginError.errors);
            expect(valid).toBe(true);
        });

        test("Should return error for unregistered user", async ({ request }) => {
            const response = await request.post("/api/login", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    email: "notregistered@example.com",
                    password: "somepassword",
                },
            });
            const responseBody = await response.json();

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBe("user not found");
            const valid = validateLoginError(responseBody);
            if (!valid) console.error(validateLoginError.errors);
            expect(valid).toBe(true);
        });
    });
});
