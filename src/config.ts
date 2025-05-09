import { z } from "zod";
import { createFunctions } from "@/functions";
import { createPrompts } from "@/prompts";

const contextConfigSchema = z.record(
  z.object({
    function: z.string().optional(),
    prompt: z.string().optional(),
  }),
);

const serverConfigSchema = z.record(contextConfigSchema);

const functionSchema = z.custom<Function>(
  (val) => {
    return typeof val === "function" || val instanceof Function;
  },
  {
    message: "Expected a function",
  },
);

const serverContextsSchema = z.record(
  z.object({
    function: z.record(functionSchema),
    prompt: z.record(functionSchema),
  }),
);

type ContextConfig = z.infer<typeof contextConfigSchema>;
type ServerConfig = z.infer<typeof serverConfigSchema>;
type ServerContexts = z.infer<typeof serverContextsSchema>;

const createContexts = (serverConfig: ServerConfig) => {
  const extractMapSchema = z.object({
    functionMap: z.record(z.string()),
    promptsMap: z.record(z.string()),
  });

  type ExtractedMaps = z.infer<typeof extractMapSchema>;

  const extractMap = (config: ContextConfig): ExtractedMaps => {
    return Object.entries(config).reduce(
      (acc, [id, value]) =>
        extractMapSchema.parse({
          functionMap: {
            ...acc.functionMap,
            ...(value.function ? { [id]: value.function } : {}),
          },
          promptsMap: {
            ...acc.promptsMap,
            ...(value.prompt ? { [id]: value.prompt } : {}),
          },
        }),
      extractMapSchema.parse({
        functionMap: {},
        promptsMap: {},
      }),
    );
  };

  let serverContexts = {};
  Object.entries(serverConfig).forEach(([contextId, contextConfig]) => {
    const { functionMap, promptsMap } = extractMap(contextConfig);
    serverContexts = {
      ...serverContexts,
      [contextId]: {
        function: Object.keys(functionMap).length > 0 ? createFunctions(functionMap) : {},
        prompt: Object.keys(promptsMap).length > 0 ? createPrompts(promptsMap) : {},
      },
    };
  });

  return serverContextsSchema.parse(serverContexts);
};

export { createContexts, ServerConfig, serverConfigSchema, ServerContexts };
