"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKeyOrderRuleException = void 0;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const nodeParentTypeToIsKeyOrderRuleExceptionMap = {
    // @ts-ignore The type doesn't contain the property "name", even though it exists.
    [experimental_utils_1.AST_NODE_TYPES.CallExpression]: (parent) => 
    // @ts-ignore The type doesn't contain the property "name", even though it exists.
    /createSlice$/i.test(parent.callee.name),
    // @ts-ignore The type doesn't contain the property "name", even though it exists.
    [experimental_utils_1.AST_NODE_TYPES.Property]: (parent) => 
    // @ts-ignore The type doesn't contain the property "name", even though it exists.
    /reducers$/i.test(parent.key.name),
};
/**
 * @param parent The parent node of the currently traversed node.
 * @returns A Boolean that checks if the parent node is a key order rule exception.
 */
const isKeyOrderRuleException = (parent) => {
    var _a;
    return (_a = nodeParentTypeToIsKeyOrderRuleExceptionMap[parent.type]) === null || _a === void 0 ? void 0 : _a.call(nodeParentTypeToIsKeyOrderRuleExceptionMap, parent);
};
exports.isKeyOrderRuleException = isKeyOrderRuleException;
//# sourceMappingURL=keysOrderHelpers.js.map