import "reflect-metadata";
import { container } from "tsyringe";
import { GeneralFunction } from "@/functions/function_types";

const functionBuilder = (functionId: string, className: string): GeneralFunction => {
  const functionIdToken = `${className}:functionId`;
  container.registerInstance(functionIdToken, functionId);
  return container.resolve(className);
};

const createFunctions = (functionMap: Record<string, string>) => {
  const functions: { [functionId: string]: Function } = {};
  for (const [functionId, className] of Object.entries(functionMap)) {
    const functionClient = functionBuilder(functionId, className);
    functions[functionId] = functionClient.execute.bind(functionClient);
  }
  return functions;
};

export { createFunctions };
