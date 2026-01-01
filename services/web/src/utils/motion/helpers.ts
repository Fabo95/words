export const getMotion = (index: number, config?: { indexDelay?: number; indexY?: number }) => {
	const delay = (config?.indexDelay ?? 0.08) * index
	const y = 12 + (config?.indexY ?? 5) * index

	return {
		initial: { opacity: 0, y },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y },
		style: { willChange: "transform" },
		transition: {
			opacity: { duration: 0.5, ease: "easeOut", delay },
			y: { type: "spring", delay, stiffness: 800, damping: 70 },
		},
	}
}
