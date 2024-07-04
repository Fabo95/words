import { TSESLint } from "@typescript-eslint/experimental-utils";
import { NoVolatileImportOptions } from "../../rules/noVolatileImport/utils/noVolatileImportTypes";
/**
 * ESLint rule to prevent imports from volatile folders.
 * This rule enforces the restriction of importing modules from folders that are considered volatile or unstable.
 */
export declare const RuleNoVolatileImport: TSESLint.RuleModule<string, NoVolatileImportOptions[]>;
