"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFunctions = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const functionBuilder = (functionId, className) => {
    const functionIdToken = `${className}:functionId`;
    tsyringe_1.container.registerInstance(functionIdToken, functionId);
    return tsyringe_1.container.resolve(className);
};
const createFunctions = (functionMap) => {
    const functions = {};
    for (const [functionId, className] of Object.entries(functionMap)) {
        const functionClient = functionBuilder(functionId, className);
        functions[functionId] = functionClient.execute.bind(functionClient);
    }
    return functions;
};
exports.createFunctions = createFunctions;
