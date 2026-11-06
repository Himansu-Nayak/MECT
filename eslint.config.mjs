import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "backend/**",
    "scratch/**",
    "mect-ai-engine/**",
    "ai-training/**",
    "**/.venv/**",
    "**/venv/**",
    "**/__pycache__/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
