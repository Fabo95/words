import { TSESLint } from "@typescript-eslint/experimental-utils";

import { checkNoVolatileImport } from "@styleguide/rules/noVolatileImport/logicNoVolatileImport";
import { NoVolatileImportOptions } from "@styleguide/rules/noVolatileImport/utils/noVolatileImportTypes";

/**
 * ESLint rule to prevent imports from volatile folders.
 * This rule enforces the restriction of importing modules from folders that are considered volatile or unstable.
 */
export const RuleNoVolatileImport: TSESLint.RuleModule<
  string,
  NoVolatileImportOptions[]
> = {
  create: checkNoVolatileImport,
  meta: {
    docs: {
      description: "No imports from volatile folders.",
      recommended: "error",
    },
    hasSuggestions: true,
    messages: {
      defaultMessage:
        "Don't import from volatile folders. Use items from the current folder or from stable folders instead {{ tmp }}.",
    },
    schema: {},
    type: "problem",
    fixable: "code",
  },
};
