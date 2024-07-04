import { TSESLint } from "@typescript-eslint/experimental-utils";

import { checkOrderReactProps } from "@styleguide/rules/reactPropsOrder/logicReactPropsOrder";

/**
 * @description When active, checks the order of props in React Components.
 * 1. Order -> Normal, dollar, spread
 * 2. Order -> Alphabetically
 *
 * This Rule will delete comments made in the opening tag of a React component.
 */
export const RuleReactPropsOrder: TSESLint.RuleModule<string, []> = {
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
  create: checkOrderReactProps,
};
