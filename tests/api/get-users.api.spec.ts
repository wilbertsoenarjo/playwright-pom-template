import { test, expect, type APIResponse } from "@playwright/test";
import Ajv from "ajv";
import { reqResUsers as users } from "../../fixtures/data/reqres-user.data";
import { getUsersSchema } from "../../fixtures/schemas/get-users.schema";

const user = users["Update user"];
const apiKey = ""

const ajv = new Ajv();
const validateGetUsersSuccess = ajv.compile(getUsersSchema);

test.describe("GetUsers", () => {
    test.describe("Positive", () => {
        let response: APIResponse;
        let responseBody: Record<string, unknown>;

        test.beforeEach(async ({ request }) => {
            response = await request.put("/api/users/", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    name: user.name,
                    job: user.job,
                },
            });
            responseBody = await response.json();
        });

        test("Should return 200 status", async () => {
            expect(response.status()).toBe(200);
            expect(responseBody.name).toBeTruthy();
        });

        test("Should validate success response schema", async () => {
            expect(response.status()).toBe(200);
            const valid = validateGetUsersSuccess(responseBody);
            if (!valid) console.error(validateGetUsersSuccess.errors);
            expect(valid).toBe(true);
        });
    });

    test.describe("Negative", () => {
        test("Should return error when name is missing", async ({ request }) => {
            const response = await request.put("/api/users/", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    job: user.job,
                },
            });
            const responseBody = await response.json();

            expect(response.status()).not.toBe(200);
            expect(responseBody).toBeTruthy();
        });

        test("Should return error when job is missing", async ({ request }) => {
            const response = await request.put("/api/users/", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    name: user.name,
                },
            });
            const responseBody = await response.json();

            expect(response.status()).not.toBe(200);
            expect(responseBody).toBeTruthy();
        });

        test("Should return error with wrong field values", async ({ request }) => {
            const response = await request.put("/api/users/", {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                data: {
                    name: 12345,
                    job: "",
                },
            });
            const responseBody = await response.json();

            expect(response.status()).not.toBe(200);
            expect(responseBody).toBeTruthy();
        });
    });
});
