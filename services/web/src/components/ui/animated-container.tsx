"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type AnimatedContainerProps = {
	children: React.ReactNode
	show: boolean
	className?: string
}

export function AnimatedContainer({ children, show, className }: AnimatedContainerProps) {
	return (
		<AnimatePresence initial={false}>
			{show && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.2, ease: "easeInOut" }}
					className={cn("overflow-hidden", className)}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}
