import { cn } from "services/words/src/utils/shadcn/shadcnHelpers"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />
}

export { Skeleton }
