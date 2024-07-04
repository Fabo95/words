import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import { ObjectLiteralElement, Property, RestElement, TSEnumMember, TypeElement } from '@typescript-eslint/types/dist/ast-spec';
export type Element = (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute) | TSEnumMember | TypeElement | ObjectLiteralElement | Property | RestElement;
/**
 * @param elements all uncategorized and unsorted elements.
 * @param sourceCode the sourceCode object used to getText.
 * @returns 2 categorized element arrays.
 */
export declare const getCategorizedElements: (elements: Element[], sourceCode: Readonly<TSESLint.SourceCode>) => Element[][];
/**
 * @param restElements all Elements except dollarElements.
 * @param dollarElements
 * @param sourceCode the sourceCode object used to getText.
 * @returns the sorted element arrays.
 */
export declare const getSortedElements: (restElements: Element[], dollarElements: Element[], sourceCode: Readonly<TSESLint.SourceCode>) => Element[];
