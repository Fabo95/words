"use client"

import { Skeleton } from "@app/components/ui/skeleton"

export function LastAddedTranslationFallback() {
	return (
		<section className="mb-12 md:mb-20">
			<div className="mb-5 text-center">
				<div className="flex justify-center mb-3">
					<Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
				</div>
				<Skeleton className="mx-auto mb-2 h-6 md:h-7 w-44" />
				<Skeleton className="mx-auto h-4 w-64 md:w-80" />
			</div>

			<div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-background/40">
				<ul className="divide-y">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton list
						<li key={i} className="px-4 py-3">
							<div className="flex items-start justify-between gap-3 md:gap-4">
								<div className="min-w-0 flex-1 flex flex-col gap-1.5 md:gap-2">
									<Skeleton className="h-5 w-20" />
									<div className="flex flex-col gap-0.5 md:flex-row md:gap-2">
										<Skeleton className="h-5 w-[60%]" />
										<Skeleton className="h-5 w-[45%]" />
									</div>
								</div>

								<div className="shrink-0 flex flex-col items-end gap-1">
									<Skeleton className="h-8 w-8 rounded" />
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
