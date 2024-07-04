"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const ruleNoVolatileImport_1 = require("../../rules/noVolatileImport/ruleNoVolatileImport");
const ruleTester = new experimental_utils_1.TSESLint.RuleTester({
    env: {
        browser: true,
        es2021: true,
    },
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
});
const validStatements = [
    {
        code: `import { allowedItem } from "node_modules/item";`,
        filename: "/folderA/file.ts",
        options: [{ importFolders: ["utils"] }],
    },
    {
        code: `import { allowedItem } from "folderA/utils/constants";`,
        filename: "/folderA/file.ts",
        options: [{ importFolders: ["utils"] }],
    },
    {
        code: `import { allowedItem } from "folderA/helpers/constants";`,
        filename: "/folderA/file.ts",
        options: [{ importFolders: ["utils", "helpers"] }],
    },
    {
        code: `import { allowedItem } from "folderA/helpers/constants";`,
        filename: "/folderA/file.ts",
        options: [{ importFolders: ["helpers"] }],
    },
    {
        code: `import { allowedItem } from "utils/constants";`,
        filename: "/folderA/file.ts",
        options: [{ importFolders: ["utils"] }],
    },
    {
        code: `import { allowedItem } from "helpers/constants";`,
        filename: "/folderA/file.ts",
        options: [{ importFolders: ["helpers"] }],
    },
    {
        code: `import { allowedItem } from "folderB/utils/constants";`,
        filename: "/folderA/file.ts",
        options: [
            {
                importFolders: ["utils"],
                excludedImportPaths: ["^folderB\\/utils\\/constants$"],
            },
        ],
    },
    {
        code: `import { allowedItem } from "folderB/utils/constants";`,
        filename: "/folderA/file.ts",
        options: [{ importFolders: ["utils"], excludedFilePaths: [".*folderA"] }],
    },
    {
        code: `import { allowedItem } from "folderB/utils/constants";`,
        filename: "/folderA/file.ts",
        options: [
            {
                importFolders: ["utils"],
                includedImportPaths: ["^folderA\\/utils\\/constants$"],
            },
        ],
    },
    {
        code: `import { allowedItem } from "folderA/utils/constants";`,
        filename: "/folderB/file.ts",
        options: [{ importFolders: ["utils"], includedFilePaths: [".*folderA"] }],
    },
];
const invalidStatements = [
    {
        code: `import { volatileItem } from "folderA/utils/constants";`,
        filename: "/folderB/file.ts",
        errors: [{ messageId: "defaultMessage" }],
        options: [{ importFolders: ["utils"] }],
    },
    {
        code: `import { volatileItem } from "folderA/helpers/constants";`,
        filename: "/folderB/file.ts",
        errors: [{ messageId: "defaultMessage" }],
        options: [{ importFolders: ["utils", "helpers"] }],
    },
    {
        code: `import { volatileItem } from "folderB/utils/constants";`,
        filename: "/folderA/file.ts",
        errors: [{ messageId: "defaultMessage" }],
        options: [
            {
                importFolders: ["utils"],
                excludedImportPaths: ["^folderA\\/utils\\/constants$"],
            },
        ],
    },
    {
        code: `import { volatileItem } from "folderA/utils/constants";`,
        filename: "/folderB/file.ts",
        errors: [{ messageId: "defaultMessage" }],
        options: [{ importFolders: ["utils"], excludedFilePaths: [".*folderA"] }],
    },
    {
        code: `import { volatileItem } from "folderB/utils/constants";`,
        filename: "/folderA/file.ts",
        errors: [{ messageId: "defaultMessage" }],
        options: [
            {
                importFolders: ["utils"],
                includedImportPaths: ["^folderB\\/utils\\/constants$"],
            },
        ],
    },
    {
        code: `import { volatileItem } from "folderB/utils/constants";`,
        filename: "/folderA/file.ts",
        errors: [{ messageId: "defaultMessage" }],
        options: [{ importFolders: ["utils"], includedFilePaths: [".*folderA"] }],
    },
];
ruleTester.run("no-volatile-import", ruleNoVolatileImport_1.RuleNoVolatileImport, {
    valid: validStatements,
    invalid: invalidStatements,
});
//# sourceMappingURL=ruleNoVolatileImport.test.js.map