/**
 * @type {Object} NoVolatileImportOptions
 * @property {string} importFolders - The names of the folders from which utils / components can be imported.
 * @property {string[]} [excludedImportPaths] - An optional array of resolved import paths that should be excluded from this rule.
 * @property {string[]} [excludedFilePaths] - An optional array of resolved file paths that should be excluded from this rule.
 * @property {string[]} [includedFilePaths] - An optional array of resolved file paths that should be included to this rule.
 * @property {string[]} [includedImportPaths] - An optional array of resolved file paths that should be included to this rule.
 */

export type NoVolatileImportOptions = {
  importFolders: string[];
  excludedImportPaths?: string[];
  excludedFilePaths?: string[];
  includedFilePaths?: string[];
  includedImportPaths?: string[];
};
