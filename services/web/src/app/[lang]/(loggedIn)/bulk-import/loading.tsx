import { Skeleton } from "@app/components/ui/skeleton"

export default function Loading() {
	return (
		<div className="w-full md:w-4/5 overflow-hidden">
			<Skeleton className="h-8 w-48 mb-4" />
			<Skeleton className="h-64 w-full" />
		</div>
	)
}
