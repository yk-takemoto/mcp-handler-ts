export abstract class GeneralPrompt {
  constructor(protected functionId: string) {}
  abstract getPromptResult(args: Record<string, unknown> | undefined): Promise<Record<string, unknown>>;
}
