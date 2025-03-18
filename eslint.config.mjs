import typescriptParser from "@typescript-eslint/parser"
import reactPlugin from "eslint-plugin-react"
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin"

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx,mts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      // your custom rules
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]
