export declare abstract class GeneralPrompt {
    protected functionId: string;
    constructor(functionId: string);
    abstract getPromptResult(args: Record<string, unknown> | undefined): Promise<Record<string, unknown>>;
}
