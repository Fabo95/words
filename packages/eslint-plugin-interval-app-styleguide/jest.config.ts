module.exports = {
  moduleNameMapper: {
    "@styleguide/(.*)": "<rootDir>/src/$1",
  },
  roots: ["<rootDir>/src"],
  testMatch: ["**/*/*.test.ts"],
  transform: {
    "\\.(js|jsx|ts|tsx)$": "@sucrase/jest-plugin",
  },
};
