"use client"

import { ReactNode } from "react"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { getMotion } from "@app/utils/motion/helpers"
import { motion } from "motion/react"
import { usePathname } from "@app/i18n/navigation"

type PageContentProps = { children: ReactNode; className?: string }

export const PageContent = ({ children, className }: PageContentProps) => {
	const pathname = usePathname()

	return (
		<motion.div
			key={pathname}
			{...getMotion(0)}
			className={cn(
				"flex flex-col h-full items-center justify-center pt-6 pb-24 px-4 md:pt-16 md:pb-16 md:px-5",
				className,
			)}
		>
			{children}
		</motion.div>
	)
}
