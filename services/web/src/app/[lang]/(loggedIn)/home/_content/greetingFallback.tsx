"use client"

import { Skeleton } from "@app/components/ui/skeleton"

export function GreetingFallback() {
	return (
		<section className="flex flex-col items-center w-full mb-12 md:mb-20">
			<Skeleton className="mb-2 h-4 w-40" />
			<Skeleton className="h-8 md:h-10 w-56 md:w-72" />
		</section>
	)
}
