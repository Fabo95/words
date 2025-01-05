import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintConfigBrowserEnv from "@words/eslint-config-browser-env";
import eslintPluginStylisticJsx from "@stylistic/eslint-plugin-jsx";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";

export default [
  ...eslintConfigBrowserEnv,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat["jsx-runtime"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      "@stylistic-jsx": eslintPluginStylisticJsx,
      "@react": eslintPluginReact,
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
    },
    rules: {
      complexity: ["error", 15],
      "@stylistic-jsx/jsx-indent": ["error", 2],
      "import/no-relative-packages": "error",
      "import/no-absolute-path": "error",
      "import/no-duplicates": "error",
      "import/first": "off",
      "import/no-cycle": "error",
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
      "@typescript-eslint/no-empty-object-type": ["error"],
      "@typescript-eslint/no-unsafe-function-type": ["error"],
      "@typescript-eslint/no-wrapper-object-types": ["error"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@react/no-array-index-key": "error",
      "@react/self-closing-comp": "error",
      "@react/no-children-prop": 2,
      "@react/no-unknown-property": ["error", { ignore: ["css"] }],
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: "last",
          ignoreCase: true,
        },
      ],
      "no-restricted-globals": "error",
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
    settings: {
      react: {
        pragma: "React",
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
        },
      },
    },
  },
];
