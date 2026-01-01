"use client"

import { ReactNode } from "react"
import { cn } from "@app/lib/utils"
import { getMotion } from "@app/utils/motion/helpers"
import { motion } from "motion/react"

type PageContentProps = { children: ReactNode; className?: string }

export const PageContent = ({ children, className }: PageContentProps) => {
	// --- RENDER ---

	return (
		<motion.div {...getMotion(0)} className={cn("flex justify-center pt-16 pb-16 items-center", className)}>
			{children}
		</motion.div>
	)
}
