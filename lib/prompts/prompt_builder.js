"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrompts = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const promptBuilder = (functionId, className) => {
    const functionIdToken = `${className}:functionId`;
    tsyringe_1.container.registerInstance(functionIdToken, functionId);
    return tsyringe_1.container.resolve(className);
};
const createPrompts = (promptMap) => {
    const functions = {};
    for (const [functionId, className] of Object.entries(promptMap)) {
        const promptClient = promptBuilder(functionId, className);
        functions[functionId] = promptClient.getPromptResult.bind(promptClient);
    }
    return functions;
};
exports.createPrompts = createPrompts;
