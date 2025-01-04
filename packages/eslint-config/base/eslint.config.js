import eslint from "@eslint/js";
import * as eslintTypescriptParser from "@typescript-eslint/parser";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginTypescript from "typescript-eslint";
import eslintPluginSecurity from "eslint-plugin-security";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginFilenames from "eslint-plugin-filenames";
import eslintPluginStylisticTs from "@stylistic/eslint-plugin-ts";

// Migrate to ts? https://github.com/eslint-functional/eslint-plugin-functional/blob/main/GETTING_STARTED.md#with-typescript
export default [
  ...eslintPluginTypescript.configs.recommended,
  eslint.configs.recommended,
  eslintPluginSecurity.configs.recommended,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginPromise.configs["flat/recommended"],
  // Any other config imports go at the top
  eslintPluginPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: eslintTypescriptParser,
      sourceType: "module",
    },
    plugins: {
      "@security": eslintPluginSecurity,
      "@filenames": eslintPluginFilenames,
      "@promise": eslintPluginPromise,
      "@stylisticTs": eslintPluginStylisticTs,
    },
    rules: {
      complexity: ["error", 10],
      "no-console": "error",
      "prettier/prettier": ["error"],
      "arrow-body-style": ["off"],
      "prefer-arrow-callback": ["off"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@stylisticTs/semi": ["error", "always"],
      "@stylisticTs/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
        },
      ],
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["variable"],
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
      ],
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          "ts-check": "allow-with-description",
          minimumDescriptionLength: 30,
        },
      ],

      "@filenames/match-regex": 2,

      "import/first": "error",
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@app/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "@app"],
          groups: [
            ["builtin", "external", "type"],
            ["internal", "parent", "sibling", "index"],
            ["object"],
          ],
        },
      ],
      "@security/detect-object-injection": "error",
      "@security/detect-non-literal-fs-filename": "error",
      "@security/detect-non-literal-regexp": "error",

      "@promise/no-callback-in-promise": "error",
    },
  },
  {
    files: ["**/models/**/*.ts"],
    rules: {
      "@filenames/match-regex": [2, "^([a-z]+|[A-Z][a-z]+)([A-Z][a-z]+)*$"],
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@filenames/match-regex": [2, "^([a-z]+)([A-Z][a-z]+)*.d$"],
    },
  },
  {
    settings: {
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/resolver": {
        typescript: {},
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
        },
      },
    },
  },
];
