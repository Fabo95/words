"use client"

import * as React from "react"
import { useIsMobile } from "@app/hooks/use-mobile"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@app/components/ui/dialog"

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@app/components/ui/drawer"

/**
 * Root
 * Keep API identical for both: open/onOpenChange.
 */
type DialogOrDrawerProps = React.ComponentProps<typeof Dialog> | React.ComponentProps<typeof Drawer>

export function DialogOrDrawer(props: DialogOrDrawerProps) {
	const isMobile = useIsMobile()
	return isMobile ? (
		<Drawer {...(props as React.ComponentProps<typeof Drawer>)} />
	) : (
		<Dialog {...(props as React.ComponentProps<typeof Dialog>)} />
	)
}

/**
 * Trigger
 */
type DialogOrDrawerTriggerProps =
	| React.ComponentProps<typeof DialogTrigger>
	| React.ComponentProps<typeof DrawerTrigger>

export function DialogOrDrawerTrigger(props: DialogOrDrawerTriggerProps) {
	const isMobile = useIsMobile()
	return isMobile ? (
		<DrawerTrigger {...(props as React.ComponentProps<typeof DrawerTrigger>)} />
	) : (
		<DialogTrigger {...(props as React.ComponentProps<typeof DialogTrigger>)} />
	)
}

/**
 * Close
 */
type DialogOrDrawerCloseProps = React.ComponentProps<typeof DialogClose> | React.ComponentProps<typeof DrawerClose>

export function DialogOrDrawerClose(props: DialogOrDrawerCloseProps) {
	const isMobile = useIsMobile()
	return isMobile ? (
		<DrawerClose {...(props as React.ComponentProps<typeof DrawerClose>)} />
	) : (
		<DialogClose {...(props as React.ComponentProps<typeof DialogClose>)} />
	)
}

/**
 * Content
 * - Desktop: shadcn DialogContent already includes Portal + Overlay + close button in your implementation.
 * - Mobile: DrawerContent already includes Portal + Overlay + drag handle in your implementation.
 */
type DialogOrDrawerContentProps =
	| React.ComponentProps<typeof DialogContent>
	| React.ComponentProps<typeof DrawerContent>

export function DialogOrDrawerContent({ className, ...props }: DialogOrDrawerContentProps) {
	const isMobile = useIsMobile()

	if (isMobile) {
		return <DrawerContent className={className} {...(props as React.ComponentProps<typeof DrawerContent>)} />
	}

	return <DialogContent className={className} {...(props as React.ComponentProps<typeof DialogContent>)} />
}

/**
 * Header
 */
type DialogOrDrawerHeaderProps = React.ComponentProps<typeof DialogHeader> | React.ComponentProps<typeof DrawerHeader>

export function DialogOrDrawerHeader({ className, ...props }: DialogOrDrawerHeaderProps) {
	const isMobile = useIsMobile()

	if (isMobile) {
		return <DrawerHeader className={className} {...(props as React.ComponentProps<typeof DrawerHeader>)} />
	}

	return <DialogHeader className={className} {...(props as React.ComponentProps<typeof DialogHeader>)} />
}

/**
 * Footer
 */
type DialogOrDrawerFooterProps = React.ComponentProps<typeof DialogFooter> | React.ComponentProps<typeof DrawerFooter>

export function DialogOrDrawerFooter({ className, ...props }: DialogOrDrawerFooterProps) {
	const isMobile = useIsMobile()

	if (isMobile) {
		return <DrawerFooter className={className} {...(props as React.ComponentProps<typeof DrawerFooter>)} />
	}

	return <DialogFooter className={className} {...(props as React.ComponentProps<typeof DialogFooter>)} />
}

/**
 * Title
 */
type DialogOrDrawerTitleProps = React.ComponentProps<typeof DialogTitle> | React.ComponentProps<typeof DrawerTitle>

export function DialogOrDrawerTitle({ className, ...props }: DialogOrDrawerTitleProps) {
	const isMobile = useIsMobile()

	if (isMobile) {
		return <DrawerTitle className={className} {...(props as React.ComponentProps<typeof DrawerTitle>)} />
	}

	return <DialogTitle className={className} {...(props as React.ComponentProps<typeof DialogTitle>)} />
}

/**
 * Description
 */
type DialogOrDrawerDescriptionProps =
	| React.ComponentProps<typeof DialogDescription>
	| React.ComponentProps<typeof DrawerDescription>

export function DialogOrDrawerDescription({ className, ...props }: DialogOrDrawerDescriptionProps) {
	const isMobile = useIsMobile()

	if (isMobile) {
		return <DrawerDescription className={className} {...(props as React.ComponentProps<typeof DrawerDescription>)} />
	}

	return <DialogDescription className={className} {...(props as React.ComponentProps<typeof DialogDescription>)} />
}
