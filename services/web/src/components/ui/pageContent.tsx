"use client"

import { ReactNode } from "react"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { getMotion } from "@app/utils/motion/helpers"
import { motion } from "motion/react"
import { usePathname } from "@app/i18n/navigation"

type PageContentProps = {
	children: ReactNode
	className?: string
	fullHeight?: boolean
}

export const PageContent = ({ children, className, fullHeight = true }: PageContentProps) => {
	const pathname = usePathname()

	// --- RENDER ---

	return (
		<motion.div
			key={pathname}
			{...getMotion(0)}
			className={cn(
				"flex flex-col pt-6 pb-24 px-4 md:pt-16 md:pb-16 md:px-5 items-center",
				fullHeight &&
					"min-h-[calc(100dvh-var(--header-height)-var(--bottom-nav-height))] md:min-h-[calc(100dvh-var(--header-height-md))]",
				className,
			)}
		>
			<div className="my-auto w-full flex flex-col items-center">{children}</div>
		</motion.div>
	)
}
