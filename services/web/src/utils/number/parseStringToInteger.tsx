export const parseStringToInteger = (value: string): number | null => {
	return Number.isInteger(Number.parseInt(value, 10)) ? Number.parseInt(value, 10) : null
}
