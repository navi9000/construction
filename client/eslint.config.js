import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import boundaries from "eslint-plugin-boundaries"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    plugins: { boundaries },
    settings: {
      "boundaries/root-path": "./src",
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      "boundaries/elements": [
        {
          type: "app",
          pattern: "app/*",
        },
        {
          type: "entities",
          pattern: "entities/*",
        },
        {
          type: "pages",
          pattern: "pages/*",
        },
        {
          type: "shared",
          pattern: "shared/*",
        },
        {
          type: "widgets",
          pattern: "widgets/*",
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          checkAllOrigins: true,
          rules: [
            {
              dependency: {
                source: [
                  "@/app/*/**",
                  "@/entities/*/**",
                  "@/pages/*/**",
                  "@/widgets/*/**",
                ],
              },
              disallow: {
                from: {
                  type: "*",
                },
              },
              message: "Import from the module public API instead.",
            },
          ],
        },
      ],
    },
  },
])
