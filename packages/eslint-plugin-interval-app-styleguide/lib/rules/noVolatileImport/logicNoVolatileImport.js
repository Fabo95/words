"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNoVolatileImport = void 0;
const noVolatileImportHelpers_1 = require("../../rules/noVolatileImport/utils/noVolatileImportHelpers");
const checkNoVolatileImport = (context) => ({
    ImportDeclaration(node) {
        testAndReport({ context, node });
    },
});
exports.checkNoVolatileImport = checkNoVolatileImport;
/**
 * Checks an import statement and reports if it violates the "No Volatile Import" rule.
 *
 * Volatile imports refer to the practice of importing modules from locations that do not belong to the current module.
 *
 * @param {TSESLint.RuleContext<string, []>} context - The rule context object provided by ESLint, which includes information and methods related to the rule being executed.
 * @param {TSESTree.StringLiteral} node - The AST node.
 * @returns {void}
 *
 */
const testAndReport = ({ context, node, }) => {
    const options = context.options[0];
    const importSource = node.source.value;
    const filePath = context.getFilename();
    const importPath = (0, noVolatileImportHelpers_1.getImportPath)({ importSource, context });
    const normalizedImportPath = (0, noVolatileImportHelpers_1.getNormalizedPath)({
        path: importPath,
    });
    const normalizedFilePath = (0, noVolatileImportHelpers_1.getNormalizedPath)({
        path: filePath,
    });
    if (normalizedImportPath.includes("node_modules") ||
        normalizedImportPath.includes("packages")) {
        return;
    }
    const isImportPathExcluded = (0, noVolatileImportHelpers_1.getIsNormalizedPathInOptionsPaths)({
        normalizedPath: normalizedImportPath,
        optionsPaths: options.excludedImportPaths,
    });
    const isFilePathExcluded = (0, noVolatileImportHelpers_1.getIsNormalizedPathInOptionsPaths)({
        normalizedPath: normalizedFilePath,
        optionsPaths: options.excludedFilePaths,
    });
    const isImportPathIncluded = (0, noVolatileImportHelpers_1.getIsNormalizedPathInOptionsPaths)({
        normalizedPath: normalizedImportPath,
        optionsPaths: options.includedImportPaths,
    });
    const isFilePathIncluded = (0, noVolatileImportHelpers_1.getIsNormalizedPathInOptionsPaths)({
        normalizedPath: normalizedFilePath,
        optionsPaths: options.includedFilePaths,
    });
    if (isImportPathExcluded || isFilePathExcluded) {
        return;
    }
    if ((options.includedImportPaths !== undefined && !isImportPathIncluded) ||
        (options.includedFilePaths !== undefined && !isFilePathIncluded)) {
        return;
    }
    const importPathSegments = normalizedImportPath.split("/");
    const isImportFolderInPathSegments = importPathSegments.some((segment) => { var _a; return (_a = options.importFolders) === null || _a === void 0 ? void 0 : _a.includes(segment); });
    if (!isImportFolderInPathSegments) {
        context.report({
            data: {
                tmp: `CURRENT VALUES 1 -> normalizedFilePath: ${normalizedFilePath}; normalizedImportPath: ${normalizedImportPath}`,
            },
            messageId: "defaultMessage",
            loc: node.source.loc,
        });
    }
    const truncatedImportPath = (0, noVolatileImportHelpers_1.getTruncatedImportPath)({
        importPathSegments: importPathSegments,
        importFolder: options.importFolders,
    });
    const isTruncatedImportPathInFilePath = normalizedFilePath === null || normalizedFilePath === void 0 ? void 0 : normalizedFilePath.includes(truncatedImportPath);
    if (isTruncatedImportPathInFilePath) {
        return;
    }
    context.report({
        data: {
            tmp: `CURRENT VALUES 2 -> normalizedFilePath: ${normalizedFilePath}; truncatedImportPath: ${truncatedImportPath}`,
        },
        messageId: "defaultMessage",
        loc: node.source.loc,
    });
};
//# sourceMappingURL=logicNoVolatileImport.js.map