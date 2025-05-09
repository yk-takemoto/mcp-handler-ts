import "reflect-metadata";
import { container } from "tsyringe";
import { GeneralPrompt } from "@/prompts/prompt_types";

const promptBuilder = (functionId: string, className: string): GeneralPrompt => {
  const functionIdToken = `${className}:functionId`;
  container.registerInstance(functionIdToken, functionId);
  return container.resolve(className);
};

const createPrompts = (promptMap: Record<string, string>) => {
  const functions: { [functionId: string]: Function } = {};
  for (const [functionId, className] of Object.entries(promptMap)) {
    const promptClient = promptBuilder(functionId, className);
    functions[functionId] = promptClient.getPromptResult.bind(promptClient);
  }
  return functions;
};

export { createPrompts };
