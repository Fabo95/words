import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@app/utils/shadcn/shadcnHelpers"

interface EmptyStateProps {
	icon: LucideIcon
	title: string
	description: string
	children?: ReactNode
	className?: string
}

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
	return (
		<div
			className={cn(
				"mx-auto max-w-md rounded-2xl border border-border/50 bg-gradient-to-b from-background/80 to-background/40 px-6 py-10 md:py-14 text-center shadow-sm",
				className
			)}
		>
			<div className="flex justify-center mb-5">
				<div className="relative">
					<div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
					<div className="relative flex h-16 w-16 md:h-18 md:w-18 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
						<Icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
					</div>
				</div>
			</div>
			<h3 className="text-lg md:text-xl font-semibold mb-2 tracking-tight">{title}</h3>
			<p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{description}</p>
			{children && <div className="mt-8">{children}</div>}
		</div>
	)
}

interface EmptyStateMessageProps {
	message: string
	hint?: string
	className?: string
}

export function EmptyStateMessage({ message, hint, className }: EmptyStateMessageProps) {
	return (
		<div
			className={cn(
				"mx-auto max-w-md rounded-2xl border border-border/50 bg-gradient-to-b from-background/80 to-background/40 px-6 py-10 md:py-14 text-center shadow-sm",
				className
			)}
		>
			<p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
			{hint && <p className="mt-3 text-xs text-muted-foreground/70">{hint}</p>}
		</div>
	)
}
