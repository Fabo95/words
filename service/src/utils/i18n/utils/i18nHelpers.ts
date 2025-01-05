import { RecursiveObjectType } from "@app/utils/i18n/utils/i18nTypes";

/**
 * Takes a nested object and an array of keys and returns the corresponding nested string value.
 */
export const getNestedObjectValue = (obj: RecursiveObjectType | string, keys: string[]): string => {
    const [first, ...rest] = keys;

    if (typeof obj === "string") {
        return obj;
    }

    if (typeof obj === "object" && obj[first]) {
        return getNestedObjectValue(obj[first], rest);
    }

    return "wrong key";
};
