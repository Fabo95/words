import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import {
  ObjectLiteralElement,
  Property,
  RestElement,
  TSEnumMember,
  TypeElement,
} from '@typescript-eslint/types/dist/ast-spec';

export type Element =
  | (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)
  | TSEnumMember
  | TypeElement
  | ObjectLiteralElement
  | Property
  | RestElement;

/**
 * @param elements all uncategorized and unsorted elements.
 * @param sourceCode the sourceCode object used to getText.
 * @returns 2 categorized element arrays.
 */
export const getCategorizedElements = (
  elements: Element[],
  sourceCode: Readonly<TSESLint.SourceCode>
) => {
  const restElements = elements.filter(
    (element) => !['{', '$'].includes(sourceCode.getText(element).charAt(0))
  );

  const dollarElements = elements.filter(
    (prop) => sourceCode.getText(prop).charAt(0) === '$'
  );

  return [restElements, dollarElements];
};

/**
 * @param restElements all Elements except dollarElements.
 * @param dollarElements
 * @param sourceCode the sourceCode object used to getText.
 * @returns the sorted element arrays.
 */
export const getSortedElements = (
  restElements: Element[],
  dollarElements: Element[],
  sourceCode: Readonly<TSESLint.SourceCode>
) => {
  const sortCallback = (elementA: Element, elementB: Element) => {
    const a = sourceCode.getText(elementA).toLocaleLowerCase();
    const b = sourceCode.getText(elementB).toLocaleLowerCase();
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  restElements.sort(sortCallback);
  dollarElements.sort(sortCallback);

  return [...restElements, ...dollarElements];
};
