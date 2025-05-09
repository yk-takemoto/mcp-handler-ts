"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfigSchema = exports.createContexts = void 0;
const zod_1 = require("zod");
const functions_1 = require("./functions");
const prompts_1 = require("./prompts");
const contextConfigSchema = zod_1.z.record(zod_1.z.object({
    function: zod_1.z.string().optional(),
    prompt: zod_1.z.string().optional(),
}));
const serverConfigSchema = zod_1.z.record(contextConfigSchema);
exports.serverConfigSchema = serverConfigSchema;
const functionSchema = zod_1.z.custom((val) => {
    return typeof val === "function" || val instanceof Function;
}, {
    message: "Expected a function",
});
const serverContextsSchema = zod_1.z.record(zod_1.z.object({
    function: zod_1.z.record(functionSchema),
    prompt: zod_1.z.record(functionSchema),
}));
const createContexts = (serverConfig) => {
    const extractMapSchema = zod_1.z.object({
        functionMap: zod_1.z.record(zod_1.z.string()),
        promptsMap: zod_1.z.record(zod_1.z.string()),
    });
    const extractMap = (config) => {
        return Object.entries(config).reduce((acc, [id, value]) => extractMapSchema.parse({
            functionMap: {
                ...acc.functionMap,
                ...(value.function ? { [id]: value.function } : {}),
            },
            promptsMap: {
                ...acc.promptsMap,
                ...(value.prompt ? { [id]: value.prompt } : {}),
            },
        }), extractMapSchema.parse({
            functionMap: {},
            promptsMap: {},
        }));
    };
    let serverContexts = {};
    Object.entries(serverConfig).forEach(([contextId, contextConfig]) => {
        const { functionMap, promptsMap } = extractMap(contextConfig);
        serverContexts = {
            ...serverContexts,
            [contextId]: {
                function: Object.keys(functionMap).length > 0 ? (0, functions_1.createFunctions)(functionMap) : {},
                prompt: Object.keys(promptsMap).length > 0 ? (0, prompts_1.createPrompts)(promptsMap) : {},
            },
        };
    });
    return serverContextsSchema.parse(serverContexts);
};
exports.createContexts = createContexts;
