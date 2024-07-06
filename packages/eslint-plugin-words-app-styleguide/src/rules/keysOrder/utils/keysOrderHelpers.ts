import {
  AST_NODE_TYPES,
  TSESTree,
} from '@typescript-eslint/experimental-utils';
import { Rule } from 'eslint';

type KeyOrderRuleExceptionNodeType =
  | AST_NODE_TYPES.CallExpression
  | AST_NODE_TYPES.Property;

const nodeParentTypeToIsKeyOrderRuleExceptionMap: Record<
  KeyOrderRuleExceptionNodeType,
  (parent: Rule.Node) => boolean
> = {
  // @ts-ignore The type doesn't contain the property "name", even though it exists.
  [AST_NODE_TYPES.CallExpression]: (parent: TSESTree.CallExpression) =>
    // @ts-ignore The type doesn't contain the property "name", even though it exists.
    /createSlice$/i.test(parent.callee.name),
  // @ts-ignore The type doesn't contain the property "name", even though it exists.
  [AST_NODE_TYPES.Property]: (parent: TSESTree.Property) =>
    // @ts-ignore The type doesn't contain the property "name", even though it exists.
    /reducers$/i.test(parent.key.name),
};

/**
 * @param parent The parent node of the currently traversed node.
 * @returns A Boolean that checks if the parent node is a key order rule exception.
 */
export const isKeyOrderRuleException = (parent: Rule.Node) =>
  nodeParentTypeToIsKeyOrderRuleExceptionMap[
    parent.type as KeyOrderRuleExceptionNodeType
  ]?.(parent);
