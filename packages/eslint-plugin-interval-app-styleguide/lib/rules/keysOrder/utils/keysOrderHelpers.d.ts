import { Rule } from 'eslint';
/**
 * @param parent The parent node of the currently traversed node.
 * @returns A Boolean that checks if the parent node is a key order rule exception.
 */
export declare const isKeyOrderRuleException: (parent: Rule.Node) => boolean;
