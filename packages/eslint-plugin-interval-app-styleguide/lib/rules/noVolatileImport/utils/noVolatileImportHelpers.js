"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportPath = exports.getTruncatedImportPath = exports.getIsNormalizedPathInOptionsPaths = exports.getNormalizedPath = void 0;
const resolve_1 = require("eslint-module-utils/resolve");
const getNormalizedPath = ({ path }) => {
    const caseInsensitiveFilePath = path.toLowerCase();
    const fileNamePattern = /\/([^\/]+)\.([^\/.]+)/;
    const isFileNameInFilePath = fileNamePattern.test(caseInsensitiveFilePath);
    if (isFileNameInFilePath) {
        // Remove the filename from the path
        const pathWithoutFileName = caseInsensitiveFilePath.replace(fileNamePattern, "");
        return pathWithoutFileName.startsWith("/")
            ? pathWithoutFileName.substring(1)
            : pathWithoutFileName;
    }
    return caseInsensitiveFilePath.startsWith("/")
        ? caseInsensitiveFilePath.substring(1)
        : caseInsensitiveFilePath;
};
exports.getNormalizedPath = getNormalizedPath;
const getIsNormalizedPathInOptionsPaths = ({ optionsPaths, normalizedPath, }) => optionsPaths === null || optionsPaths === void 0 ? void 0 : optionsPaths.some((path) => new RegExp(path, "i").test(normalizedPath));
exports.getIsNormalizedPathInOptionsPaths = getIsNormalizedPathInOptionsPaths;
const getTruncatedImportPath = ({ importPathSegments, importFolder, }) => {
    const importFolderIndex = importPathSegments.findIndex((pathSegment) => importFolder === null || importFolder === void 0 ? void 0 : importFolder.includes(pathSegment));
    const truncatedImportPathSegments = importFolderIndex !== -1
        ? importPathSegments.slice(0, importFolderIndex)
        : importPathSegments;
    return truncatedImportPathSegments.join("/");
};
exports.getTruncatedImportPath = getTruncatedImportPath;
const getImportPath = ({ importSource, context, }) => {
    const importPath = (0, resolve_1.default)(importSource, context);
    return importPath || importSource;
};
exports.getImportPath = getImportPath;
//# sourceMappingURL=noVolatileImportHelpers.js.map