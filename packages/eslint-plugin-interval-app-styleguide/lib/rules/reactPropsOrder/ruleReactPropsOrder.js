"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleReactPropsOrder = void 0;
const logicReactPropsOrder_1 = require("../../rules/reactPropsOrder/logicReactPropsOrder");
/**
 * @description When active, checks the order of props in React Components.
 * 1. Order -> Normal, dollar, spread
 * 2. Order -> Alphabetically
 *
 * This Rule will delete comments made in the opening tag of a React component.
 */
exports.RuleReactPropsOrder = {
    meta: {
        docs: {
            description: "No unordered props in React components.",
            recommended: "error",
        },
        messages: {
            defaultMessage: "Order props of React component.",
        },
        schema: {},
        type: "layout",
        fixable: "code",
        hasSuggestions: true,
    },
    create: logicReactPropsOrder_1.checkOrderReactProps,
};
//# sourceMappingURL=ruleReactPropsOrder.js.map