export const getUsersSchema = {
    type: "object",
    additionalProperties: false,
    required: ["name", "job", "updatedAt", "_meta"],
    properties: {
        name: { type: "string" },
        job: { type: "string" },
        updatedAt: { type: "string" },
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
                message: { type: "string" },
                cta: {
                    type: "object",
                    additionalProperties: false,
                    required: ["label", "url"],
                    properties: {
                        label: { type: "string" },
                        url: { type: "string" },
                    },
                },
                context: { type: "string" },
            },
        },
    },
};
