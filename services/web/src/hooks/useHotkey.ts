import { useEffect, useCallback, useRef } from "react"

type ModifierKey = "ctrl" | "meta" | "alt" | "shift" | "ctrlOrMeta"

type HotkeyDefinition = {
	/**
	 * The key to listen for. Can be:
	 * - A key value: "a", "b", "1", "Enter", "Escape"
	 * - A key code: "Space", "Digit1", "KeyA"
	 */
	key: string
	/**
	 * Modifier keys required. Use "ctrlOrMeta" for cross-platform shortcuts.
	 */
	modifiers?: ModifierKey[]
	/**
	 * Callback to execute when the hotkey is triggered.
	 */
	handler: (event: KeyboardEvent) => void
	/**
	 * Whether to prevent the default browser behavior.
	 * @default true
	 */
	preventDefault?: boolean
	/**
	 * Whether this hotkey is currently enabled.
	 * @default true
	 */
	enabled?: boolean
}

type UseHotkeyOptions = Omit<HotkeyDefinition, "key" | "handler">

/**
 * Hook for registering a single keyboard hotkey.
 *
 * @example
 * // Simple key
 * useHotkey("Space", () => flipCard())
 *
 * // With modifiers
 * useHotkey("s", () => save(), { modifiers: ["ctrlOrMeta"] })
 *
 * // Conditional
 * useHotkey("Enter", () => submit(), { enabled: isFormValid })
 *
 * // Number keys (both regular and numpad)
 * useHotkey("1", () => selectOption(1)) // matches both Digit1 and Numpad1
 */
export const useHotkey = (key: string, handler: () => void, options: UseHotkeyOptions = {}) => {
	useHotkeys([{ key, handler, ...options }])
}

/**
 * Hook for registering multiple keyboard hotkeys efficiently.
 * Uses a single event listener for all hotkeys.
 *
 * @example
 * useHotkeys([
 *   { key: "Space", handler: () => flipCard(), enabled: !isFlipped },
 *   { key: "1", handler: () => grade("again"), enabled: showButtons },
 *   { key: "2", handler: () => grade("hard"), enabled: showButtons },
 *   { key: "3", handler: () => grade("good"), enabled: showButtons },
 *   { key: "4", handler: () => grade("easy"), enabled: showButtons },
 * ])
 */
export const useHotkeys = (hotkeys: HotkeyDefinition[]) => {
	// Use ref to always have access to the latest handlers without re-registering the listener
	const hotkeysRef = useRef(hotkeys)
	hotkeysRef.current = hotkeys

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		// Skip if target is an input element (unless it's a special key like Escape)
		const target = event.target as HTMLElement
		const isInputElement =
			target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable

		for (const hotkey of hotkeysRef.current) {
			const { key, modifiers = [], handler, preventDefault = true, enabled = true } = hotkey

			if (!enabled) continue

			// Check if the key matches
			const keyMatches = matchesKey(event, key)
			if (!keyMatches) continue

			// Check modifiers
			const modifiersMatch = matchesModifiers(event, modifiers)
			if (!modifiersMatch) continue

			// Skip input elements for regular keys (allow Escape, etc.)
			if (isInputElement && !isSpecialKey(key) && modifiers.length === 0) {
				continue
			}

			if (preventDefault) {
				event.preventDefault()
			}

			handler(event)
			return // Only trigger the first matching hotkey
		}
	}, [])

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])
}

/**
 * Check if the keyboard event matches the specified key.
 * Supports both key values and key codes.
 */
const matchesKey = (event: KeyboardEvent, key: string): boolean => {
	// Normalize the key for comparison
	const normalizedKey = key.toLowerCase()
	const eventKey = event.key.toLowerCase()
	const eventCode = event.code.toLowerCase()

	// Direct match on key value
	if (eventKey === normalizedKey) return true

	// Direct match on code
	if (eventCode === normalizedKey) return true

	// Special handling for number keys (match both Digit and Numpad)
	if (/^[0-9]$/.test(key)) {
		return eventCode === `digit${key}` || eventCode === `numpad${key}`
	}

	// Special handling for letter keys
	if (/^[a-z]$/i.test(key)) {
		return eventCode === `key${key.toUpperCase()}`
	}

	return false
}

/**
 * Check if the required modifiers are pressed.
 */
const matchesModifiers = (event: KeyboardEvent, modifiers: ModifierKey[]): boolean => {
	const requiredCtrl = modifiers.includes("ctrl")
	const requiredMeta = modifiers.includes("meta")
	const requiredCtrlOrMeta = modifiers.includes("ctrlOrMeta")
	const requiredAlt = modifiers.includes("alt")
	const requiredShift = modifiers.includes("shift")

	// Check ctrl/meta (with ctrlOrMeta support for cross-platform)
	if (requiredCtrlOrMeta) {
		if (!event.ctrlKey && !event.metaKey) return false
	} else {
		if (requiredCtrl && !event.ctrlKey) return false
		if (requiredMeta && !event.metaKey) return false
		// If no ctrl/meta required, make sure none are pressed (unless ctrlOrMeta is used)
		if (!requiredCtrl && !requiredMeta && !requiredCtrlOrMeta) {
			if (event.ctrlKey || event.metaKey) return false
		}
	}

	// Check alt
	if (requiredAlt && !event.altKey) return false
	if (!requiredAlt && event.altKey) return false

	// Check shift
	if (requiredShift && !event.shiftKey) return false
	if (!requiredShift && event.shiftKey) return false

	return true
}

/**
 * Keys that should work even when focused on input elements.
 */
const isSpecialKey = (key: string): boolean => {
	const specialKeys = ["escape", "esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"]
	return specialKeys.includes(key.toLowerCase())
}
