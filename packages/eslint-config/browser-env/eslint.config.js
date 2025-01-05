import eslintPluginCompat from "eslint-plugin-compat";
import eslintPluginNoUnsanitized from "eslint-plugin-no-unsanitized";
import eslintPluginFunctional from "eslint-plugin-functional";
import baseEslintConfig from "@words/eslint-config-base/eslint.config.js";

export default [
  ...baseEslintConfig,
  eslintPluginCompat.configs["flat/recommended"],
  eslintPluginNoUnsanitized.configs.recommended,
  eslintPluginFunctional.configs.externalVanillaRecommended,
  eslintPluginFunctional.configs.recommended,
  eslintPluginFunctional.configs.stylistic,
  eslintPluginFunctional.configs.disableTypeChecked,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        projectService: true,
      },
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      "@functional": eslintPluginFunctional,
    },
    rules: {
      "@functional/prefer-readonly-type": "off",
      "@functional/functional-parameters": "off",
      "@functional/no-expression-statement": "off",
      "@functional/immutable-data": "off",
      "@functional/no-conditional-statement": "off",
      "@functional/no-return-void": "error",
    },
  },
];
