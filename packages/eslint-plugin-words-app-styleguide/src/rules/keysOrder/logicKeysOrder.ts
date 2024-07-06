import { isEqual, partition } from 'lodash';
import { SourceLocation } from '@typescript-eslint/types/dist/ast-spec';
import {
  AST_NODE_TYPES,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { Rule } from 'eslint';

import {
  Element,
  getCategorizedElements,
  getSortedElements,
} from '@styleguide/rules/utils/elementOrderHelpers';
import { isKeyOrderRuleException } from '@styleguide/rules/keysOrder/utils/keysOrderHelpers';

export const checkOrderKeys = (
  context: TSESLint.RuleContext<string, []>
): TSESLint.RuleListener => {
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
      testAndReport(context, loc, properties, type, parent as Rule.Node);
    },
    ObjectPattern({ loc, properties, type, parent }) {
      testAndReport(context, loc, properties, type, parent as Rule.Node);
    },
  };
};

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
const testAndReport = (
  context: TSESLint.RuleContext<string, []>,
  location: SourceLocation,
  elements: Element[],
  type: AST_NODE_TYPES,
  parent?: Rule.Node
) => {
  if (parent && isKeyOrderRuleException(parent)) {
    return;
  }

  const sourceCode = context.getSourceCode();

  const [restKeys, dollarKeys] = getCategorizedElements(elements, sourceCode);

  const unsortedKeys = elements.filter(
    (element) => !['{', '.'].includes(sourceCode.getText(element).charAt(0))
  );

  let sortedKeys = getSortedElements(restKeys, dollarKeys, sourceCode).filter(
    (element) => !(sourceCode.getText(element).charAt(0) === '.')
  );

  if (type === AST_NODE_TYPES.ObjectExpression) {
    const [shortHandProperties, restKeys] = partition(
      sortedKeys,
      (item) => item.type === 'Property' && item.shorthand
    );

    sortedKeys = [...shortHandProperties, ...restKeys];
  }

  if (isEqual(unsortedKeys, sortedKeys)) {
    return;
  }

  context.report({
    messageId: 'defaultMessage',
    loc: location,
    *fix(fixer) {
      for (let i = 0; i < sortedKeys.length; i++) {
        yield fixer.replaceText(
          unsortedKeys[i],
          sourceCode.getText(sortedKeys[i])
        );
      }
    },
  });
};
