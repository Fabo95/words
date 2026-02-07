"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import { useSuspenseQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { getLearnStatsQueryOptions, getCollectionsQueryOptions } from "@app/utils/reactQuery/queryOptions"
import { $api } from "@app/utils/api/apiRequests"
import { LearningLanding } from "./learningLanding"
import { LearningSession, ReviewGrade } from "./learningSession"
import { LearningSessionComplete } from "./learningSessionComplete"
import { useLearningSessionQuery } from "./utils/useLearningSessionQuery"

export function Learning() {
	const queryClient = useQueryClient()

	const { state, actions } = useLearningSessionQuery()
	const [isLoading, setIsLoading] = useState(false)
	const [reverseMode, setReverseMode] = useState(false)
	const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null)

	const {
		data: { data: collections },
	} = useSuspenseQuery(getCollectionsQueryOptions())

	const {
		data: statsResponse,
		isLoading: isStatsLoading,
	} = useQuery(getLearnStatsQueryOptions({ collectionId: selectedCollectionId }))

	const stats = statsResponse?.data

	const { mutateAsync: fetchLearnItems } = $api.useMutation("get", "/learn")

	const handleStartLearning = useCallback(async () => {
		setIsLoading(true)
		try {
			const result = await fetchLearnItems({
				params: {
					query: {
						limit: 10,
						include_new: true,
						...(selectedCollectionId ? { collection_id: selectedCollectionId } : {}),
					},
				},
			})

			if (result.data?.items && result.data.items.length > 0) {
				actions.startSession(result.data.items)
			}
		} finally {
			setIsLoading(false)
		}
	}, [fetchLearnItems, actions, selectedCollectionId])

	const handleReview = useCallback(
		(grade: ReviewGrade, translationId: number) => {
			actions.submitReview(grade, translationId)
		},
		[actions],
	)

	const handleComplete = useCallback(async () => {
		await queryClient.invalidateQueries({
			queryKey: getLearnStatsQueryOptions({ collectionId: selectedCollectionId }).queryKey,
		})
		actions.restart()
	}, [queryClient, actions, selectedCollectionId])

	const handleContinue = useCallback(async () => {
		await queryClient.invalidateQueries({
			queryKey: getLearnStatsQueryOptions({ collectionId: selectedCollectionId }).queryKey,
		})
		setIsLoading(true)
		try {
			const result = await fetchLearnItems({
				params: {
					query: {
						limit: 10,
						include_new: true,
						...(selectedCollectionId ? { collection_id: selectedCollectionId } : {}),
					},
				},
			})

			if (result.data?.items && result.data.items.length > 0) {
				actions.startSession(result.data.items)
			} else {
				actions.restart()
			}
		} finally {
			setIsLoading(false)
		}
	}, [queryClient, fetchLearnItems, actions, selectedCollectionId])

	if (state.phase === "landing") {
		return (
			<LearningLanding
				stats={stats}
				isStatsLoading={isStatsLoading}
				collections={collections ?? []}
				selectedCollectionId={selectedCollectionId}
				onCollectionChange={setSelectedCollectionId}
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
