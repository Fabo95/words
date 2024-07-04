import { TSESLint } from "@typescript-eslint/experimental-utils";
import { TSESTree } from "@typescript-eslint/experimental-utils/dist/ts-estree";

import {
  getIsNormalizedPathInOptionsPaths,
  getNormalizedPath,
  getTruncatedImportPath,
  getImportPath,
} from "@styleguide/rules/noVolatileImport/utils/noVolatileImportHelpers";
import { NoVolatileImportOptions } from "@styleguide/rules/noVolatileImport/utils/noVolatileImportTypes";

export const checkNoVolatileImport = (
  context: TSESLint.RuleContext<string, NoVolatileImportOptions[]>
): TSESLint.RuleListener => ({
  ImportDeclaration(node) {
    testAndReport({ context, node });
  },
});

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

const testAndReport = ({
  context,
  node,
}: {
  context: TSESLint.RuleContext<string, NoVolatileImportOptions[]>;
  node: TSESTree.ImportDeclaration;
}): void => {
  const options = context.options[0];

  const importSource = node.source.value;

  const filePath = context.getFilename();
  const importPath = getImportPath({ importSource, context });

  const normalizedImportPath = getNormalizedPath({
    path: importPath,
  });

  const normalizedFilePath = getNormalizedPath({
    path: filePath,
  });

  if (
    normalizedImportPath.includes("node_modules") ||
    normalizedImportPath.includes("packages")
  ) {
    return;
  }

  const isImportPathExcluded = getIsNormalizedPathInOptionsPaths({
    normalizedPath: normalizedImportPath,
    optionsPaths: options.excludedImportPaths,
  });

  const isFilePathExcluded = getIsNormalizedPathInOptionsPaths({
    normalizedPath: normalizedFilePath,
    optionsPaths: options.excludedFilePaths,
  });

  const isImportPathIncluded = getIsNormalizedPathInOptionsPaths({
    normalizedPath: normalizedImportPath,
    optionsPaths: options.includedImportPaths,
  });

  const isFilePathIncluded = getIsNormalizedPathInOptionsPaths({
    normalizedPath: normalizedFilePath,
    optionsPaths: options.includedFilePaths,
  });

  if (isImportPathExcluded || isFilePathExcluded) {
    return;
  }

  if (
    (options.includedImportPaths !== undefined && !isImportPathIncluded) ||
    (options.includedFilePaths !== undefined && !isFilePathIncluded)
  ) {
    return;
  }

  const importPathSegments = normalizedImportPath.split("/");

  const isImportFolderInPathSegments = importPathSegments.some((segment) =>
    options.importFolders?.includes(segment)
  );

  if (!isImportFolderInPathSegments) {
    context.report({
      data: {
        tmp: `CURRENT VALUES 1 -> normalizedFilePath: ${normalizedFilePath}; normalizedImportPath: ${normalizedImportPath}`,
      },
      messageId: "defaultMessage",
      loc: node.source.loc,
    });
  }

  const truncatedImportPath = getTruncatedImportPath({
    importPathSegments: importPathSegments,
    importFolder: options.importFolders,
  });

  const isTruncatedImportPathInFilePath =
    normalizedFilePath?.includes(truncatedImportPath);

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
