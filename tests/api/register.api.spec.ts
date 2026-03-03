import { test, expect, type APIResponse } from "@playwright/test";
import Ajv from "ajv";
import { reqResUsers as users } from "../../fixtures/data/reqres-user.data";
import { registerSchema } from "../../fixtures/schemas/register.schema";

const user = users["Register user"];
const apiKey = ""

const ajv = new Ajv();
const validateRegisterSuccess = ajv.compile(registerSchema);

test.describe("Register", () => {
    test.describe("Positive", () => {
        let response: APIResponse;
        let responseBody: Record<string, unknown>;

        test.beforeEach(async ({ request }) => {
            response = await request.post("/api/register", {
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

        test("Should return 200 status", async () => {
            expect(response.status()).toBe(200);
            expect(responseBody.id).toBeTruthy();
        });

        test("Should validate success response schema", async () => {
            expect(response.status()).toBe(200);
            const valid = validateRegisterSuccess(responseBody);
            if (!valid) console.error(validateRegisterSuccess.errors);
            expect(valid).toBe(true);
        });
    });

    test.describe("Negative", () => {
        test("Should return error when email is missing", async ({ request }) => {
            const response = await request.post("/api/register", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    password: user.password,
                },
            });
            const responseBody = await response.json();
            expect(response.status()).not.toBe(200);
            expect(responseBody.error).toBeTruthy();
        });

        test("Should return error when password is missing", async ({ request }) => {
            const response = await request.post("/api/register", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    email: user.email,
                },
            });
            const responseBody = await response.json();
            expect(response.status()).not.toBe(200);
            expect(responseBody.error).toBeTruthy();
        });

        test("Should return error with wrong field values", async ({ request }) => {
            const response = await request.post("/api/register", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    email: 12345,
                    password: "",
                },
            });
            const responseBody = await response.json();
            expect(response.status()).not.toBe(200);
            expect(responseBody.error).toBeTruthy();
        });
    });
});
