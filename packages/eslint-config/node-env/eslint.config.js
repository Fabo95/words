import eslintConfigBase from "@words/eslint-config-base/eslint.config.js";

export default [
  ...eslintConfigBase,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
