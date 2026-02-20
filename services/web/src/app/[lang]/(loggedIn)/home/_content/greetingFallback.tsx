"use client"

import { Skeleton } from "@app/components/ui/skeleton"

export function GreetingFallback() {
	return (
		<section className="mb-6">
			<Skeleton className="mx-auto mb-1 h-4 w-32" />
			<Skeleton className="mx-auto h-7 md:h-9 w-48 md:w-56" />
		</section>
	)
}
