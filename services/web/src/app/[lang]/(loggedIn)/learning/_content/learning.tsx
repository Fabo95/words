"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query"
import { getLearnStatsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { $api } from "@app/utils/api/apiRequests"
import { LearningLanding } from "./learningLanding"
import { LearningSession } from "./learningSession"
import { LearningSessionComplete } from "./learningSessionComplete"
import { LearningEmptyState } from "./learningEmptyState"
import { useLearningSessionQuery } from "./utils/useLearningSessionQuery"

export function Learning() {
	const queryClient = useQueryClient()

	const { state, actions } = useLearningSessionQuery()
	const [isLoading, setIsLoading] = useState(false)
	const [reverseMode, setReverseMode] = useState(false)

	const {
		data: { data: stats },
	} = useSuspenseQuery(getLearnStatsQueryOptions())

	const { refetch: fetchItems } = $api.useQuery("get", "/learn", {
		params: {
			query: {
				limit: 10,
				include_new: true,
			},
		},
		enabled: false,
	})

	const handleStartLearning = useCallback(async () => {
		setIsLoading(true)
		try {
			const result = await fetchItems()

			if (result.data?.data?.items && result.data.data.items.length > 0) {
				actions.startSession(result.data.data.items)
			}
		} finally {
			setIsLoading(false)
		}
	}, [fetchItems, actions])

	const handleReview = useCallback(
		(correct: boolean, translationId: number) => {
			actions.submitReview(correct, translationId)
		},
		[actions],
	)

	const handleComplete = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: getLearnStatsQueryOptions().queryKey })
		actions.restart()
	}, [queryClient, actions])

	const handleContinue = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: getLearnStatsQueryOptions().queryKey })
		setIsLoading(true)
		try {
			const result = await fetchItems()

			if (result.data?.data?.items && result.data.data.items.length > 0) {
				actions.startSession(result.data.data.items)
			} else {
				actions.restart()
			}
		} finally {
			setIsLoading(false)
		}
	}, [queryClient, fetchItems, actions])

	const hasItemsToLearn = (stats?.due_count ?? 0) + (stats?.new_count ?? 0) > 0

	if (state.phase === "landing") {
		if (!hasItemsToLearn) {
			return <LearningEmptyState />
		}

		return (
			<LearningLanding
				stats={stats}
				onStartLearning={handleStartLearning}
				isLoading={isLoading}
				reverseMode={reverseMode}
				onReverseModeChange={setReverseMode}
			/>
		)
	}

	if (state.phase === "session") {
		const currentItem = state.data.items[state.data.currentIndex]
		if (!currentItem) {
			actions.restart()
			return null
		}

		return (
			<LearningSession
				currentItem={currentItem}
				currentIndex={state.data.currentIndex}
				totalItems={state.data.items.length}
				onReview={handleReview}
				reverseMode={reverseMode}
			/>
		)
	}

	if (state.phase === "complete") {
		return (
			<LearningSessionComplete
				results={state.data.results}
				totalItems={state.data.totalItems}
				onContinue={handleContinue}
				onFinish={handleComplete}
			/>
		)
	}

	return null
}
