"use client"

import * as React from "react"
import { Skeleton } from "@app/components/ui/skeleton"

export function LastAddedTranslationFallback() {
	return (
		<section className="mb-20">
			{/* keep the same header layout */}
			<Skeleton className="mx-auto mb-2 h-6 w-44" />
			<Skeleton className="mx-auto mb-4 h-4 w-80" />

			{/* list container */}
			<div className="mx-auto overflow-hidden rounded-xl border bg-background/40">
				<ul className="divide-y">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton list
						<li key={i} className="px-4 py-3">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0 flex-1">
									<Skeleton className="h-5 w-[70%]" />
									<Skeleton className="mt-2 h-4 w-[55%]" />
								</div>

								<div className="shrink-0 text-right">
									<Skeleton className="h-3 w-14" />
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
