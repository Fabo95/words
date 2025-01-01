import eslintConfigBase from "@words/eslint-config-base/eslint.config.js";

export default [
  ...eslintConfigBase,
  {
    files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
