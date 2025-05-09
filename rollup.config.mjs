import pluginTypescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

const external = [
  "zod",
  "tsyringe",
  "reflect-metadata"
];

const globals = {
  "zod": "zod",
  "tsyringe": "tsyringe",
  "reflect-metadata": "Reflect"
};

const plugins = [
  pluginTypescript({
    tsconfig: './tsconfig.json',
    sourceMap: true,
  }), 
  resolve(),
  commonjs()
];

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    external,
    plugins: [...plugins, terser()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.esm.js",
      format: "esm",
      sourcemap: true,
    },
    external,
    plugins,
  },
  {
    input: "./src/index.ts",
    output: {
      name: "mcpHandler",
      file: "./lib/bundle.umd.js",
      format: "umd",
      sourcemap: true,
      globals,
    },
    external,
    plugins: [...plugins, terser()],
  },
];