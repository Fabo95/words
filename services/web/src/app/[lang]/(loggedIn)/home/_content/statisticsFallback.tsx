"use client"

import { Card } from "@app/components/ui/card"
import { Skeleton } from "@app/components/ui/skeleton"

export function StatisticsFallback() {
	return (
		<section className="mb-8">
			<Card className="p-4 gap-0">
				<div className="flex items-center gap-2 mb-2">
					<Skeleton className="h-7 w-7 rounded-lg" />
					<Skeleton className="h-5 w-24" />
				</div>
				<Skeleton className="h-4 w-56" />
			</Card>
		</section>
	)
}
