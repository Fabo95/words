import { TSESLint } from '@typescript-eslint/experimental-utils';
import { checkOrderKeys } from '@styleguide/rules/keysOrder/logicKeysOrder';

/**
 * @description When active, checks the order of keys in objects.
 * This Rule will delete comments.
 */
export const RuleKeysOrder: TSESLint.RuleModule<string, []> = {
  create: checkOrderKeys,
  meta: {
    docs: {
      description: 'No unordered keys in objects.',
      recommended: 'error',
      url: 'https://gitlab.campusjaeger.de/campusjaeger/frontend-guidelines/-/blob/master/ORDER.md',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      defaultMessage: 'Order keys alphabetically.',
    },
    schema: {},
    type: 'layout',
  },
};
