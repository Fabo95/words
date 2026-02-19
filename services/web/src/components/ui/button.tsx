import * as React from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { Spinner } from "@app/components/ui/spinner"

const buttonVariants = cva(
	"inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
	{
		defaultVariants: {
			size: "default",
			variant: "default",
		},
		variants: {
			size: {
				default: "h-9 px-4 py-2",
				icon: "h-9 w-9",
				lg: "h-10 rounded-md px-8",
				sm: "h-8 rounded-md px-3 text-xs",
			},
			variant: {
				default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			},
		},
	},
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ asChild = false, className, size, variant, isLoading, children, ...props }, ref) => {
		const Comp = asChild ? Slot : "button"
		return (
			<Comp className={cn(buttonVariants({ size, variant }), "relative", className)} ref={ref} {...props}>
				{isLoading && (
					<span className="absolute inset-0 flex items-center justify-center">
						<Spinner />
					</span>
				)}
				<span className={cn("flex items-center", isLoading && "invisible")}>{children}</span>
			</Comp>
		)
	},
)
Button.displayName = "Button"

export { Button, buttonVariants }
