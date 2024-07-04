"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruleNoVolatileImport_1 = require("./rules/noVolatileImport/ruleNoVolatileImport");
const ruleKeysOrder_1 = require("./rules/keysOrder/ruleKeysOrder");
const ruleReactPropsOrder_1 = require("./rules/reactPropsOrder/ruleReactPropsOrder");
module.exports = {
    rules: {
        "keys-order": ruleKeysOrder_1.RuleKeysOrder,
        "no-volatile-import": ruleNoVolatileImport_1.RuleNoVolatileImport,
        "react-props-order": ruleReactPropsOrder_1.RuleReactPropsOrder,
    },
};
//# sourceMappingURL=index.js.map