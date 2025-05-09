import "reflect-metadata";
declare const createPrompts: (promptMap: Record<string, string>) => {
    [functionId: string]: Function;
};
export { createPrompts };
