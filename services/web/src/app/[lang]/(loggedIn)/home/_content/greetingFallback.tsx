"use client"

import * as React from "react"
import { Skeleton } from "@app/components/ui/skeleton"

export function GreetingFallback() {
	return (
		<section className="flex flex-col items-center w-full">
			<Skeleton className="mb-1 h-5 w-40" />

			<Skeleton className="mb-1 h-7 w-48.75" />
		</section>
	)
}
