"use client"

import { cn } from "@app/utils/shadcn/shadcnHelpers"

type ProgressRingProps = {
	value: number
	size?: number
	strokeWidth?: number
	className?: string
}

export function ProgressRing({ value, size = 24, strokeWidth = 3, className }: ProgressRingProps) {
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI
	const clampedValue = Math.min(100, Math.max(0, value))
	const offset = circumference - (clampedValue / 100) * circumference

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			className={cn("transform -rotate-90", className)}
		>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				className="text-muted-foreground/20"
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				className={cn(
					"transition-all duration-300 ease-out",
					clampedValue >= 100 ? "text-green-500" : "text-primary"
				)}
			/>
		</svg>
	)
}
