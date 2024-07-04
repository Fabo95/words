import { TSESLint } from "@typescript-eslint/experimental-utils";
import { isEqual } from "lodash";

import {
  getCategorizedElements,
  getSortedElements,
} from "@styleguide/rules/utils/elementOrderHelpers";

export const checkOrderReactProps = (
  context: TSESLint.RuleContext<string, []>
): TSESLint.RuleListener => {
  const sourceCode = context.getSourceCode();

  return {
    JSXOpeningElement(node) {
      const [restProps, dollarProps] = getCategorizedElements(
        node.attributes,
        sourceCode
      );

      const unsortedProps = node.attributes.filter(
        (prop) => prop.type !== "JSXSpreadAttribute" && prop.value !== null
      );

      const sortedProps = getSortedElements(
        restProps,
        dollarProps,
        sourceCode
      ).filter((prop) => prop.type === "JSXAttribute" && prop.value !== null);

      if (isEqual(unsortedProps, sortedProps)) return;

      context.report({
        messageId: "defaultMessage",
        loc: node.loc,
        *fix(fixer) {
          for (let i = 0; i < sortedProps.length; i++) {
            yield fixer.replaceText(
              unsortedProps[i],
              sourceCode.getText(sortedProps[i])
            );
          }
        },
      });
    },
  };
};
