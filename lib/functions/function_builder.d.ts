import "reflect-metadata";
declare const createFunctions: (functionMap: Record<string, string>) => {
    [functionId: string]: Function;
};
export { createFunctions };
