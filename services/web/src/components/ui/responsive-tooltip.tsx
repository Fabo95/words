"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { useIsMobile } from "@app/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@app/components/ui/drawer"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type ResponsiveTooltipProps = {
	children: React.ReactNode
	content: React.ReactNode
	title?: string
	side?: "top" | "right" | "bottom" | "left"
	className?: string
}

export function ResponsiveTooltip({ children, content, title, side = "top", className }: ResponsiveTooltipProps) {
	const isMobile = useIsMobile()
	const [open, setOpen] = React.useState(false)

	if (isMobile) {
		return (
			<>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className={cn("text-muted-foreground hover:text-foreground transition-colors", className)}
					aria-label="More info"
				>
					{children}
				</button>

				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerContent>
						<DrawerHeader>
							{title && <DrawerTitle>{title}</DrawerTitle>}
							<DrawerDescription asChild>
								<div className="text-sm text-muted-foreground">{content}</div>
							</DrawerDescription>
						</DrawerHeader>
					</DrawerContent>
				</Drawer>
			</>
		)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent side={side} className="max-w-xs">
				{content}
			</TooltipContent>
		</Tooltip>
	)
}
