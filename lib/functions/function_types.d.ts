export declare abstract class GeneralFunction {
    protected functionId: string;
    constructor(functionId: string);
    abstract execute(args: Record<string, unknown> | undefined): Promise<Record<string, unknown> | Record<string, unknown>[]>;
}
