"use client"

import * as React from "react"

import { useIsMobile } from "@app/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipTrigger } from "@app/components/ui/tooltip"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@app/components/ui/drawer"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

type ResponsiveTooltipProps = {
	children: React.ReactElement
	content: React.ReactNode
	title?: string
	side?: "top" | "right" | "bottom" | "left"
	className?: string
}

export function ResponsiveTooltip({ children, content, title, side = "top", className }: ResponsiveTooltipProps) {
	const isMobile = useIsMobile()
	const [open, setOpen] = React.useState(false)

	if (isMobile) {
		// Clone the child element and add onClick handler to open the drawer
		const childWithHandler = React.cloneElement(children, {
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation()
				setOpen(true)
				// Call original onClick if it exists
				if (children.props.onClick) {
					children.props.onClick(e)
				}
			},
			className: cn(children.props.className, className),
		})

		return (
			<>
				{childWithHandler}

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
			<TooltipTrigger asChild>{React.cloneElement(children, { className: cn(children.props.className, className) })}</TooltipTrigger>
			<TooltipContent side={side} className="max-w-xs">
				{content}
			</TooltipContent>
		</Tooltip>
	)
}
