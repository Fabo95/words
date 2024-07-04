import { RuleNoVolatileImport } from "@styleguide/rules/noVolatileImport/ruleNoVolatileImport";
import { RuleKeysOrder } from "@styleguide/rules/keysOrder/ruleKeysOrder";
import { RuleReactPropsOrder } from "@styleguide/rules/reactPropsOrder/ruleReactPropsOrder";

module.exports = {
  rules: {
    "keys-order": RuleKeysOrder,
    "no-volatile-import": RuleNoVolatileImport,
    "react-props-order": RuleReactPropsOrder,
  },
};
