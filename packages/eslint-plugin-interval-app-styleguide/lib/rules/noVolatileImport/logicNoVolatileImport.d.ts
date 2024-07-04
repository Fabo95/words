import { TSESLint } from "@typescript-eslint/experimental-utils";
import { NoVolatileImportOptions } from "../../rules/noVolatileImport/utils/noVolatileImportTypes";
export declare const checkNoVolatileImport: (context: TSESLint.RuleContext<string, NoVolatileImportOptions[]>) => TSESLint.RuleListener;
