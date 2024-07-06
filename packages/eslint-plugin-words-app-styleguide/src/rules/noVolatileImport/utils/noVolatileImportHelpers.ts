import resolve from "eslint-module-utils/resolve";
import { TSESLint } from "@typescript-eslint/experimental-utils";
import { NoVolatileImportOptions } from "@styleguide/rules/noVolatileImport/utils/noVolatileImportTypes";

export const getNormalizedPath = ({ path }: { path: string }) => {
  const caseInsensitiveFilePath = path.toLowerCase();

  const fileNamePattern = /\/([^\/]+)\.([^\/.]+)/;

  const isFileNameInFilePath = fileNamePattern.test(caseInsensitiveFilePath);

  if (isFileNameInFilePath) {
    // Remove the filename from the path
    const pathWithoutFileName = caseInsensitiveFilePath.replace(
      fileNamePattern,
      ""
    );

    return pathWithoutFileName.startsWith("/")
      ? pathWithoutFileName.substring(1)
      : pathWithoutFileName;
  }

  return caseInsensitiveFilePath.startsWith("/")
    ? caseInsensitiveFilePath.substring(1)
    : caseInsensitiveFilePath;
};

export const getIsNormalizedPathInOptionsPaths = ({
  optionsPaths,
  normalizedPath,
}: {
  optionsPaths?: string[];
  normalizedPath: string;
}) => optionsPaths?.some((path) => new RegExp(path, "i").test(normalizedPath));

export const getTruncatedImportPath = ({
  importPathSegments,
  importFolder,
}: {
  importPathSegments: string[];
  importFolder: string[];
}) => {
  const importFolderIndex = importPathSegments.findIndex((pathSegment) =>
    importFolder?.includes(pathSegment)
  );

  const truncatedImportPathSegments =
    importFolderIndex !== -1
      ? importPathSegments.slice(0, importFolderIndex)
      : importPathSegments;

  return truncatedImportPathSegments.join("/");
};

export const getImportPath = ({
  importSource,
  context,
}: {
  importSource: string;
  context: TSESLint.RuleContext<string, NoVolatileImportOptions[]>;
}) => {
  const importPath = resolve(importSource, context);

  return importPath || importSource;
};
