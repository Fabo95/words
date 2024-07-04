import { TSESLint } from "@typescript-eslint/experimental-utils";
import { NoVolatileImportOptions } from "../../../rules/noVolatileImport/utils/noVolatileImportTypes";
export declare const getNormalizedPath: ({ path }: {
    path: string;
}) => string;
export declare const getIsNormalizedPathInOptionsPaths: ({ optionsPaths, normalizedPath, }: {
    optionsPaths?: string[] | undefined;
    normalizedPath: string;
}) => boolean | undefined;
export declare const getTruncatedImportPath: ({ importPathSegments, importFolder, }: {
    importPathSegments: string[];
    importFolder: string[];
}) => string;
export declare const getImportPath: ({ importSource, context, }: {
    importSource: string;
    context: TSESLint.RuleContext<string, NoVolatileImportOptions[]>;
}) => any;
