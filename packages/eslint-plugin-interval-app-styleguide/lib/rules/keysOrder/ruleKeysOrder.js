"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleKeysOrder = void 0;
const logicKeysOrder_1 = require("../../rules/keysOrder/logicKeysOrder");
/**
 * @description When active, checks the order of keys in objects.
 * This Rule will delete comments.
 */
exports.RuleKeysOrder = {
    create: logicKeysOrder_1.checkOrderKeys,
    meta: {
        docs: {
            description: 'No unordered keys in objects.',
            recommended: 'error',
            url: 'https://gitlab.campusjaeger.de/campusjaeger/frontend-guidelines/-/blob/master/ORDER.md',
        },
        fixable: 'code',
        hasSuggestions: true,
        messages: {
            defaultMessage: 'Order keys alphabetically.',
        },
        schema: {},
        type: 'layout',
    },
};
//# sourceMappingURL=ruleKeysOrder.js.map