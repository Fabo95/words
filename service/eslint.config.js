import eslintPluginNoRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import * as typescriptEslintParser from "@typescript-eslint/parser";
import eslintConfigReact from "@words/eslint-config-react";

export default [
    ...eslintConfigReact,
    {
        plugins: {
            "@no-relative-import-paths": eslintPluginNoRelativeImportPaths,
        },
        files: ["**/*.{ts,tsx}"],
        ignores: [".next/**", "node_modules", "**/*.js", "**/*.typegen.ts", "**/*.css"],
        rules: {
            "@no-relative-import-paths/no-relative-import-paths": "error",
            "@filenames/match-regex": "off",
            "compat/compat": "off",
            "@typescript-eslint/no-unnecessary-type-constraint": "off",
            "@typescript-eslint/naming-convention": "off",
            "@react/jsx-uses-react": "off",
            "@react/react-in-jsx-scope": "off",
            "@react/prop-types": "off",
            "@promise/catch-or-return": "off",
            "@promise/no-callback-in-promise": "off",
            "@promise/always-return": "off",
            "@promise/no-return-wrap": "off",
            "@functional/no-return-void": "off",
            "@functional/no-let": "error",
            "@functional/prefer-immutable-types": "off",
            "@functional/no-loop-statement": "off",
            "@functional/no-try-statement": "off",
            "@functional/no-conditional-statements": "off",
            "@functional/no-this-expression": "off",
            "@functional/no-class": "off",
            "@functional/no-throw-statement": "off",
            "@functional/no-mixed-type": "off",
            "@functional/no-mixed-types": "off",
            "@functional/no-expression-statements": "off",
            "@security/detect-object-injection": "off",
            "@security/detect-non-literal-fs-filename": "off",
            "@security/detect-non-literal-regexp": "off",
            "@react/display-name": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        },
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: ["tsconfig.json"],
                },
            },
        },
    },
];
