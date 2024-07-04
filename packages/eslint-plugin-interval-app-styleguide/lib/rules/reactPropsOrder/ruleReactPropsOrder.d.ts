import { TSESLint } from "@typescript-eslint/experimental-utils";
/**
 * @description When active, checks the order of props in React Components.
 * 1. Order -> Normal, dollar, spread
 * 2. Order -> Alphabetically
 *
 * This Rule will delete comments made in the opening tag of a React component.
 */
export declare const RuleReactPropsOrder: TSESLint.RuleModule<string, []>;
