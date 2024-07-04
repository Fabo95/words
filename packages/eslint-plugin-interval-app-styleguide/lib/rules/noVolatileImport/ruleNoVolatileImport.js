"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleNoVolatileImport = void 0;
const logicNoVolatileImport_1 = require("../../rules/noVolatileImport/logicNoVolatileImport");
/**
 * ESLint rule to prevent imports from volatile folders.
 * This rule enforces the restriction of importing modules from folders that are considered volatile or unstable.
 */
exports.RuleNoVolatileImport = {
    create: logicNoVolatileImport_1.checkNoVolatileImport,
    meta: {
        docs: {
            description: "No imports from volatile folders.",
            recommended: "error",
        },
        hasSuggestions: true,
        messages: {
            defaultMessage: "Don't import from volatile folders. Use items from the current folder or from stable folders instead {{ tmp }}.",
        },
        schema: {},
        type: "problem",
        fixable: "code",
    },
};
//# sourceMappingURL=ruleNoVolatileImport.js.map