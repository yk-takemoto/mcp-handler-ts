import { z } from "zod";
declare const serverConfigSchema: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodObject<{
    function: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    function?: string | undefined;
    prompt?: string | undefined;
}, {
    function?: string | undefined;
    prompt?: string | undefined;
}>>>;
declare const serverContextsSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    function: z.ZodRecord<z.ZodString, z.ZodType<Function, z.ZodTypeDef, Function>>;
    prompt: z.ZodRecord<z.ZodString, z.ZodType<Function, z.ZodTypeDef, Function>>;
}, "strip", z.ZodTypeAny, {
    function: Record<string, Function>;
    prompt: Record<string, Function>;
}, {
    function: Record<string, Function>;
    prompt: Record<string, Function>;
}>>;
type ServerConfig = z.infer<typeof serverConfigSchema>;
type ServerContexts = z.infer<typeof serverContextsSchema>;
declare const createContexts: (serverConfig: ServerConfig) => Record<string, {
    function: Record<string, Function>;
    prompt: Record<string, Function>;
}>;
export { createContexts, ServerConfig, serverConfigSchema, ServerContexts };
