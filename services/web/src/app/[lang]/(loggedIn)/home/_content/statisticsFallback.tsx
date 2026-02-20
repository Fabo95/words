"use client"

import { Skeleton } from "@app/components/ui/skeleton"

export function StatisticsFallback() {
	return (
		<section className="mb-12">
			<div className="mb-5 text-center">
				<div className="flex justify-center mb-3">
					<Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
				</div>
				<Skeleton className="mx-auto mb-2 h-6 md:h-7 w-32" />
				<Skeleton className="mx-auto h-4 w-48" />
			</div>

			<div className="mx-auto overflow-hidden rounded-xl border bg-background/40">
				<div className="px-4 py-4">
					<div className="flex items-center justify-between border-b pb-3 mb-3">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-6 w-12" />
					</div>

					<Skeleton className="h-4 w-40 mb-2" />
					<ul className="mt-2 space-y-2">
						{Array.from({ length: 4 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton list
							<li key={i} className="flex items-center justify-between">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-8" />
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}
