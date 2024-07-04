"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrderReactProps = void 0;
const lodash_1 = require("lodash");
const elementOrderHelpers_1 = require("../../rules/utils/elementOrderHelpers");
const checkOrderReactProps = (context) => {
    const sourceCode = context.getSourceCode();
    return {
        JSXOpeningElement(node) {
            const [restProps, dollarProps] = (0, elementOrderHelpers_1.getCategorizedElements)(node.attributes, sourceCode);
            const unsortedProps = node.attributes.filter((prop) => prop.type !== "JSXSpreadAttribute" && prop.value !== null);
            const sortedProps = (0, elementOrderHelpers_1.getSortedElements)(restProps, dollarProps, sourceCode).filter((prop) => prop.type === "JSXAttribute" && prop.value !== null);
            if ((0, lodash_1.isEqual)(unsortedProps, sortedProps))
                return;
            context.report({
                messageId: "defaultMessage",
                loc: node.loc,
                *fix(fixer) {
                    for (let i = 0; i < sortedProps.length; i++) {
                        yield fixer.replaceText(unsortedProps[i], sourceCode.getText(sortedProps[i]));
                    }
                },
            });
        },
    };
};
exports.checkOrderReactProps = checkOrderReactProps;
//# sourceMappingURL=logicReactPropsOrder.js.map