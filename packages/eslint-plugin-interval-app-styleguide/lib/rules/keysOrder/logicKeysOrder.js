"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrderKeys = void 0;
const lodash_1 = require("lodash");
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const elementOrderHelpers_1 = require("../../rules/utils/elementOrderHelpers");
const keysOrderHelpers_1 = require("../../rules/keysOrder/utils/keysOrderHelpers");
const checkOrderKeys = (context) => {
    return {
        TSEnumDeclaration({ loc, members, type }) {
            testAndReport(context, loc, members, type);
        },
        TSInterfaceBody({ loc, body, type }) {
            testAndReport(context, loc, body, type);
        },
        TSTypeLiteral({ loc, members, type }) {
            testAndReport(context, loc, members, type);
        },
        ObjectExpression({ loc, properties, type, parent }) {
            testAndReport(context, loc, properties, type, parent);
        },
        ObjectPattern({ loc, properties, type, parent }) {
            testAndReport(context, loc, properties, type, parent);
        },
    };
};
exports.checkOrderKeys = checkOrderKeys;
/**
 * Checks expressions and reports rule violations for objects' alphabetical prop order.
 *
 * @param context An object that contains information that is relevant to the context of the currently traversed node, like its source code or its scope.
 * @param location An object specifying the location of the node within the source code.
 * @param elements An array of all the other nodes that are contained in the node.
 * @param type A string literal that contains the AST node type of the node.
 * @param parent The parent node of the currently traversed node.
 * @returns void
 */
const testAndReport = (context, location, elements, type, parent) => {
    if (parent && (0, keysOrderHelpers_1.isKeyOrderRuleException)(parent)) {
        return;
    }
    const sourceCode = context.getSourceCode();
    const [restKeys, dollarKeys] = (0, elementOrderHelpers_1.getCategorizedElements)(elements, sourceCode);
    const unsortedKeys = elements.filter((element) => !['{', '.'].includes(sourceCode.getText(element).charAt(0)));
    let sortedKeys = (0, elementOrderHelpers_1.getSortedElements)(restKeys, dollarKeys, sourceCode).filter((element) => !(sourceCode.getText(element).charAt(0) === '.'));
    if (type === experimental_utils_1.AST_NODE_TYPES.ObjectExpression) {
        const [shortHandProperties, restKeys] = (0, lodash_1.partition)(sortedKeys, (item) => item.type === 'Property' && item.shorthand);
        sortedKeys = [...shortHandProperties, ...restKeys];
    }
    if ((0, lodash_1.isEqual)(unsortedKeys, sortedKeys)) {
        return;
    }
    context.report({
        messageId: 'defaultMessage',
        loc: location,
        *fix(fixer) {
            for (let i = 0; i < sortedKeys.length; i++) {
                yield fixer.replaceText(unsortedKeys[i], sourceCode.getText(sortedKeys[i]));
            }
        },
    });
};
//# sourceMappingURL=logicKeysOrder.js.map