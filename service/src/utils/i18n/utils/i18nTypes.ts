import GermanTranslation from "@app/utils/i18n/dictionaries/de.json";

export type Dictionary = typeof GermanTranslation;

export type TFunction = (
    translationKey: Join<ObjectPaths<Dictionary>, ".">,
    interpolation?: Record<string, string | number>
) => string;

/**
 * Recursive type that reference itself to type nested objects.
 * @see https://stackoverflow.com/questions/71654892/how-type-recursive-object-in-typescript
 */
export type RecursiveObjectType = {
    [key: string]: string | RecursiveObjectType;
};

/**
 * Creates a union of tuple types with all the possible paths through the nested object structure, where each tuple represents a path of keys to a specific object value.
 *
 * @See: https://stackoverflow.com/questions/47057649/typescript-string-dot-notation-of-nested-object
 *
 * @Example:
 * The return type looks like the following:
 *
 * type ExampleReturnType =
 *   | ["pages", "intervalTimer", "headline"]
 *   | ["pages", "intervalTimer", "menuOption"]
 *   | ["pages", "intervalTimer", "intervalTimerSettingOption", "optionOne"]
 *   | ["pages", "intervalTimer", "intervalTimerSettingOption", "optionTwo"]
 *   | ["pages", "intervalTimer", "intervalTimerSettingOption", "optionThree"]
 *   | ["pages", "intervalTimer", "intervalTimerSettingOption", "optionFour"]
 *   | ["pages", "intervalTimer", "intervalTimerSettingOption", "optionFive"]
 *   | ["pages", "intervalTimer", "intervalTimerOverview", "timeLeft"]
 *   | ["pages", "settings", "headline"]
 *   | ["pages", "settings", "menuOption"]
 *
 */

export type ObjectPaths<T> = T extends string
    ? []
    : {
          [K in Extract<keyof T, string>]: [K, ...ObjectPaths<T[K]>];
      }[Extract<keyof T, string>];

// Recursively joins an array of strings to a string seperated by D.
export type Join<T extends string[], D extends string> = T extends []
    ? never
    : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
    ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
    : string;
