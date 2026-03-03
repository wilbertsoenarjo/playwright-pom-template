Generate an AJV schema file from the following pipe-delimited arguments:

`$ARGUMENTS`

## Argument format

```
<SchemaName> | <JSON response body>
```

- `<SchemaName>`: PascalCase name, e.g. `Register`, `GetUser`, `CreateProduct`
- `<JSON response body>`: A real captured JSON response, e.g. `{"id": 4, "token": "QpwL5tpe83ilfN2"}`

## Derivations

From `<SchemaName>`:
- **kebab-name**: lowercase with hyphens — `Register` → `register`, `GetUser` → `get-user`, `CreateProduct` → `create-product`
- **camelName**: camelCase — `Register` → `register`, `GetUser` → `getUser`, `CreateProduct` → `createProduct`

## Type inference rules

Inspect each value in the JSON and map to AJV schema types:

| JSON value type | Schema type |
|----------------|-------------|
| `string` | `{ type: "string" }` |
| `number` (integer or float) | `{ type: "number" }` |
| `boolean` | `{ type: "boolean" }` |
| `object` | Nested schema with `type: "object"`, `additionalProperties: false`, `required: [all keys]`, `properties: { ... }` recursively |
| `array` | `{ type: "array", minItems: 1, items: <schema from first element> }` |
| `null` | `{ type: ["string", "null"] }` and add a comment `// TODO: review — was null in sample` |

All object schemas must have:
- `additionalProperties: false`
- `required` listing every observed key

## Output — produce exactly two code blocks

### Code block 1: Schema file

File path: `fixtures/schemas/<kebab-name>.schema.ts`

Follow this canonical style exactly (from `fixtures/schemas/login.schema.ts`):

```typescript
export const <camelName>Schema = {
    type: "object",
    additionalProperties: false,
    required: [<all top-level keys as quoted strings>],
    properties: {
        // one entry per key, recursively expanded for objects/arrays
    }
};

export const <camelName>ErrorSchema = {
    type: "object",
    additionalProperties: false,
    required: ["error"],
    properties: {
        error: { type: "string" }
    }
};
```

Rules:
- 4-space indentation, double quotes throughout
- `additionalProperties: false` on every object schema, including nested ones
- The error schema always uses `"error"` as the required field — add a comment `// TODO: adjust if your API uses a different error field name` after `required: ["error"]`

### Code block 2: Import and usage snippet

Ready-to-paste snippet for the spec file:

```typescript
// Add to imports in your spec file:
import { <camelName>Schema, <camelName>ErrorSchema } from "../../fixtures/schemas/<kebab-name>.schema";

// Add after imports at module level:
const validate<SchemaName>Success = ajv.compile(<camelName>Schema);
const validate<SchemaName>Error = ajv.compile(<camelName>ErrorSchema);

// Usage in a test:
const valid = validate<SchemaName>Success(responseBody);
if (!valid) console.error(validate<SchemaName>Success.errors);
expect(valid).toBe(true);
```

## Final instructions

Output only the two code blocks with file path comments above each, like:

```
// fixtures/schemas/<kebab-name>.schema.ts
<code block 1>

// Snippet — add to your spec file
<code block 2>
```

Do not include explanations outside the code blocks. The engineer will copy-paste directly.
