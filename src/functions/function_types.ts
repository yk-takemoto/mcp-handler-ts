export abstract class GeneralFunction {
  constructor(protected functionId: string) {}
  abstract execute(args: Record<string, unknown> | undefined): Promise<Record<string, unknown> | Record<string, unknown>[]>;
}
