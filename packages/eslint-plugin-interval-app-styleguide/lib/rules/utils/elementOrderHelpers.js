"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortedElements = exports.getCategorizedElements = void 0;
/**
 * @param elements all uncategorized and unsorted elements.
 * @param sourceCode the sourceCode object used to getText.
 * @returns 2 categorized element arrays.
 */
const getCategorizedElements = (elements, sourceCode) => {
    const restElements = elements.filter((element) => !['{', '$'].includes(sourceCode.getText(element).charAt(0)));
    const dollarElements = elements.filter((prop) => sourceCode.getText(prop).charAt(0) === '$');
    return [restElements, dollarElements];
};
exports.getCategorizedElements = getCategorizedElements;
/**
 * @param restElements all Elements except dollarElements.
 * @param dollarElements
 * @param sourceCode the sourceCode object used to getText.
 * @returns the sorted element arrays.
 */
const getSortedElements = (restElements, dollarElements, sourceCode) => {
    const sortCallback = (elementA, elementB) => {
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
exports.getSortedElements = getSortedElements;
//# sourceMappingURL=elementOrderHelpers.js.map