export const loginSchema = {
    type: "object",
    additionalProperties: false,
    required: ["token", "_meta"],
    properties: {
        token: { type: "string" },
        _meta: {
            type: "object",
            additionalProperties: false,
            required: ["powered_by", "docs_url", "upgrade_url", "example_url", "variant", "message", "cta", "context"],
            properties: {
                powered_by: { type: "string" },
                docs_url: { type: "string" },
                upgrade_url: { type: "string" },
                example_url: { type: "string" },
                variant: { type: "string" },
                message: {
                    type: "string",
                    const: "Classic ReqRes still works. Projects add persistence, auth, and logs."
                },
                cta: {
                    type: "object",
                    additionalProperties: false,
                    required: ["label", "url"],
                    properties: {
                        label: { type: "string" },
                        url: { type: "string" }
                    }
                },
                context: { type: "string" }
            }
        }
    }
};

export const loginErrorSchema = {
    type: "object",
    additionalProperties: false,
    required: ["error"],
    properties: {
        error: { type: "string" }
    }
};
