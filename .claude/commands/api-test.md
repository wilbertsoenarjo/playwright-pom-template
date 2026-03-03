Generate a complete API test suite from the following arguments:

## Usage

/api-test <kebab-name> | <METHOD> <endpoint> | <baseURL> | <request> | <response>

- `<kebab-name>`  lowercase-with-hyphens, e.g. `register`, `get-user`, `create-product`
- `<METHOD>`      HTTP verb: GET POST PUT PATCH DELETE
- `<endpoint>`    path only, e.g. `/api/register`
- `<baseURL>`     full URL e.g. `https://reqres.in`, or `-` to configure later
- `<request>`     full JSON request body, or `-` for GET requests with no body
- `<response>`    full JSON success response body

Examples:
```
/api-test register | POST /api/register | https://reqres.in | {"email": "user@example.com", "password": "password123"} | {"id": 4, "token": "QpwL5tpe83ilfN2"}
/api-test get-user | GET /api/users/1 | https://reqres.in | - | {"data": {"id": 1, "email": "g.bluth@reqres.in", "first_name": "George"}}
/api-test create-product | POST /api/products | - | {"name": "Laptop", "price": 999.99} | {"id": 101, "name": "Laptop", "price": 999.99}
```

`$ARGUMENTS`

## Argument format

```
<kebab-name> | <METHOD> <endpoint> | <baseURL> | <request> | <response>
```

- `<kebab-name>`: lowercase-with-hyphens, e.g. `register`, `get-user`, `create-product`
- `<METHOD> <endpoint>`: e.g. `POST /api/register`, `GET /api/users/1`
- `<baseURL>`: Full URL like `https://reqres.in`, or `-` if not known (note to engineer to set their own)
- `<request>`: Full JSON request body, e.g. `{"email": "user@example.com", "password": "password123"}`. Use `-` for GET requests with no body
- `<response>`: Full JSON success response body, e.g. `{"id": 4, "token": "QpwL5tpe83ilfN2"}`

## Derivations

From `<kebab-name>`:
- **camelName**: camelCase — `register` → `register`, `get-user` → `getUser`, `create-product` → `createProduct`
- **PascalName**: PascalCase — `register` → `Register`, `get-user` → `GetUser`, `create-product` → `CreateProduct`
- **User entry key**: `"<kebab-name> user"` — `register` → `"register user"`, `get-user` → `"get-user user"`

## Output — produce exactly three code blocks

### Code block 1: Schema file

File path: `fixtures/schemas/<kebab-name>.schema.ts`

Export only `<camelName>Schema`. Infer types from the `<response>` JSON values:
- `string` value → `{ type: "string" }`
- `number` value → `{ type: "number" }`
- `boolean` value → `{ type: "boolean" }`
- `object` value → nested schema object with `additionalProperties: false`, all keys in `required`
- `array` value → `{ type: "array", minItems: 1, items: <schema inferred from first element> }`
- `null` value → `{ type: ["string", "null"] }` with a `// TODO: verify actual type` comment

Rules:
- 4-space indentation, double quotes throughout
- `additionalProperties: false` on every schema object
- All keys from response JSON must appear in `required`

Example for `{"id": 4, "token": "QpwL5tpe83ilfN2"}`:
```typescript
export const registerSchema = {
    type: "object",
    additionalProperties: false,
    required: ["id", "token"],
    properties: {
        id: { type: "number" },
        token: { type: "string" },
    }
};
```

No error schema is exported.

### Code block 2: User data entry

Snippet to add to `fixtures/data/user.data.ts` inside the `users` object.

For POST/PUT/PATCH requests with `<request>` JSON:
- Use the actual field names and values from the pasted JSON as defaults
```typescript
    "<kebab-name> user": {
        <field>: <value from request JSON>,
        // one entry per key in request JSON
    },
```

For GET requests (`<request>` is `-`):
```typescript
    "<kebab-name> user": {
        // No request body — GET endpoint
    },
```

### Code block 3: Spec file

File path: `tests/api/<kebab-name>.api.spec.ts`

Follow the canonical pattern from `tests/api/reqres.api.spec.ts` exactly:

```typescript
import { test, expect, type APIResponse } from "@playwright/test";
import Ajv from "ajv";
import { users } from "../../fixtures/data/user.data";
import { <camelName>Schema } from "../../fixtures/schemas/<kebab-name>.schema";

const user = users["<kebab-name> user"];
const apiKey = "";

const ajv = new Ajv();
const validate<PascalName>Success = ajv.compile(<camelName>Schema);

test.describe("<PascalName>", () => {
    test.describe("Positive", () => {
        let response: APIResponse;
        let responseBody: Record<string, unknown>;

        test.beforeEach(async ({ request }) => {
            response = await request.<method>("<endpoint>", {
                // omit headers block if apiKey is unused / no special headers needed
                // omit data block for GET requests
                data: {
                    <field>: user.<field>,
                    // one entry per key in request JSON; omit for GET
                },
            });
            responseBody = await response.json();
        });

        test("Should return <status> status", async () => {
            expect(response.status()).toBe(<successStatus>);
            // assert one key success field is truthy
            expect(responseBody.<firstResponseField>).toBeTruthy();
        });

        test("Should validate success response schema", async () => {
            expect(response.status()).toBe(<successStatus>);
            const valid = validate<PascalName>Success(responseBody);
            if (!valid) console.error(validate<PascalName>Success.errors);
            expect(valid).toBe(true);
        });
    });

    test.describe("Negative", () => {
        // For POST/PUT/PATCH: one test per request JSON key checking missing field scenario
        test("Should return error when <field> is missing", async ({ request }) => {
            // send all fields except the missing one; inline assertions only
        });

        // For POST/PUT/PATCH: wrong-value test
        test("Should return error with wrong field values", async ({ request }) => {
            // send obviously wrong values; inline assertions only
        });

        // For GET: nonexistent entity test
        test("Should return error for nonexistent <resource>", async ({ request }) => {
            // request a clearly invalid ID or resource (e.g. ID 99999); inline assertions only
        });
    });
});
```

Rules:
- 4-space indentation, double quotes everywhere
- `successStatus`: `200` for GET, `201` for POST (override if endpoint semantics differ)
- `method`: `post` / `get` / `put` / `patch` / `delete` matching `<METHOD>` (lowercase)
- Use `console.error(validator.errors)` pattern on schema validation failures
- Only `validate<PascalName>Success` — no error validator in the spec
- Negative tests use inline assertions only — no schema validation in negative tests
- Negative tests for missing fields: generate one `test(...)` per key in request JSON, omitting that key from the request body
- Negative test for wrong values: send the request with clearly invalid values (e.g., numeric string where email is expected, empty string for password)
- Negative test for nonexistent entity (GET): use an obviously fake ID like `99999`
- Do not add `apiKey` header wiring unless the engineer explicitly sets it — leave `const apiKey = "";` at the top as a placeholder
- Populate the `data` block with actual key-value pairs from request JSON: `<field>: user.<field>` for each key

## Final instructions

Output only the three code blocks with file path comments above each, like:

```
// fixtures/schemas/<kebab-name>.schema.ts
<code block 1>

// fixtures/data/user.data.ts — add this entry to the users object
<code block 2>

// tests/api/<kebab-name>.api.spec.ts
<code block 3>
```

Do not include explanations outside the code blocks. The engineer will copy-paste directly.
