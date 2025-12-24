/**
 * Helper to run immediately-invoked-function-expressions (IIFE) inline and clean.
 */
export const run =
	// biome-ignore lint/suspicious/noExplicitAny: biome migration
	<T extends () => any, TReturn extends ReturnType<T>>(callback: T): TReturn => callback()
