"use client"

import { Skeleton } from "@app/components/ui/skeleton"

export function ProgressChartFallback() {
	return (
		<section className="mb-12">
			<div className="mb-5 text-center">
				<div className="flex justify-center mb-3">
					<Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
				</div>
				<Skeleton className="mx-auto mb-2 h-6 w-24" />
				<Skeleton className="mx-auto h-4 w-48" />
			</div>

			<div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-background/40">
				<div className="px-4 py-4">
					<Skeleton className="h-9 w-full mb-4" />
					<Skeleton className="h-48 w-full" />
					<div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
						<div className="text-center">
							<Skeleton className="mx-auto h-8 w-12 mb-1" />
							<Skeleton className="mx-auto h-3 w-16" />
						</div>
						<div className="text-center">
							<Skeleton className="mx-auto h-8 w-12 mb-1" />
							<Skeleton className="mx-auto h-3 w-16" />
						</div>
						<div className="text-center">
							<Skeleton className="mx-auto h-8 w-12 mb-1" />
							<Skeleton className="mx-auto h-3 w-16" />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
