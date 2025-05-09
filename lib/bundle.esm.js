import { z } from 'zod';
import 'reflect-metadata';
import { container } from 'tsyringe';

const functionBuilder = (functionId, className) => {
    const functionIdToken = `${className}:functionId`;
    container.registerInstance(functionIdToken, functionId);
    return container.resolve(className);
};
const createFunctions = (functionMap) => {
    const functions = {};
    for (const [functionId, className] of Object.entries(functionMap)) {
        const functionClient = functionBuilder(functionId, className);
        functions[functionId] = functionClient.execute.bind(functionClient);
    }
    return functions;
};

class GeneralFunction {
    constructor(functionId) {
        this.functionId = functionId;
    }
}

const promptBuilder = (functionId, className) => {
    const functionIdToken = `${className}:functionId`;
    container.registerInstance(functionIdToken, functionId);
    return container.resolve(className);
};
const createPrompts = (promptMap) => {
    const functions = {};
    for (const [functionId, className] of Object.entries(promptMap)) {
        const promptClient = promptBuilder(functionId, className);
        functions[functionId] = promptClient.getPromptResult.bind(promptClient);
    }
    return functions;
};

class GeneralPrompt {
    constructor(functionId) {
        this.functionId = functionId;
    }
}

const contextConfigSchema = z.record(z.object({
    function: z.string().optional(),
    prompt: z.string().optional(),
}));
const serverConfigSchema = z.record(contextConfigSchema);
const functionSchema = z.custom((val) => {
    return typeof val === "function" || val instanceof Function;
}, {
    message: "Expected a function",
});
const serverContextsSchema = z.record(z.object({
    function: z.record(functionSchema),
    prompt: z.record(functionSchema),
}));
const createContexts = (serverConfig) => {
    const extractMapSchema = z.object({
        functionMap: z.record(z.string()),
        promptsMap: z.record(z.string()),
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
                function: Object.keys(functionMap).length > 0 ? createFunctions(functionMap) : {},
                prompt: Object.keys(promptsMap).length > 0 ? createPrompts(promptsMap) : {},
            },
        };
    });
    return serverContextsSchema.parse(serverContexts);
};

export { GeneralFunction, GeneralPrompt, createContexts, createFunctions, createPrompts, serverConfigSchema };
//# sourceMappingURL=bundle.esm.js.map
