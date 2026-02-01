"use client"

import { useCallback, useMemo } from "react"
import { z } from "zod"
import { useSearchParamState } from "@app/utils/urls/useSearchParamState"
import { LearnItem, LearnItemApiResponse, learnItemSchema } from "@app/utils/types/api"

const reviewResultSchema = z.object({
	translationId: z.number(),
	correct: z.boolean(),
})

const sessionDataSchema = z.object({
	items: z.array(learnItemSchema),
	currentIndex: z.number(),
	results: z.array(reviewResultSchema),
})

const completeDataSchema = z.object({
	results: z.array(reviewResultSchema),
	totalItems: z.number(),
})

type SessionData = z.infer<typeof sessionDataSchema>
type CompleteData = z.infer<typeof completeDataSchema>

export type LearningSessionState =
	| { phase: "landing" }
	| { phase: "session"; data: SessionData }
	| { phase: "complete"; data: CompleteData }

export type LearningSessionActions = {
	startSession: (items: LearnItemApiResponse[]) => void
	submitReview: (correct: boolean, translationId: number) => void
	completeSession: () => void
	restart: () => void
}

// URL-safe base64 encoding
function toUrlSafeBase64(str: string): string {
	return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromUrlSafeBase64(str: string): string {
	let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
	// Add padding if needed
	while (base64.length % 4) {
		base64 += "="
	}
	return atob(base64)
}

function encodeSessionData(data: SessionData | CompleteData): string {
	return toUrlSafeBase64(JSON.stringify(data))
}

function decodeSessionData<T>(encoded: string, schema: z.ZodSchema<T>): T | null {
	try {
		const parsed = JSON.parse(fromUrlSafeBase64(encoded))
		return schema.parse(parsed)
	} catch {
		return null
	}
}

function toLearnItem(item: LearnItemApiResponse): LearnItem {
	return {
		id: item.id,
		sourceText: item.source_text,
		targetText: item.target_text,
		isNew: item.is_new,
	}
}

export function useLearningSessionQuery(): {
	state: LearningSessionState
	actions: LearningSessionActions
} {
	const [phase, setPhase] = useSearchParamState<string>("phase", "search", "string", "replace")
	const [encodedData, setEncodedData] = useSearchParamState<string>("data", "search", "string", "replace")

	const restart = useCallback(() => {
		const url = "/learning"
		setPhase(undefined, url, { scroll: false })
		setEncodedData(undefined, url, { scroll: false })
	}, [setPhase, setEncodedData])

	const state = useMemo<LearningSessionState>(() => {
		if (phase === "session" && encodedData) {
			const data = decodeSessionData(encodedData, sessionDataSchema)
			if (data?.items && data.items.length > 0) {
				return { phase: "session", data }
			}
		}

		if (phase === "complete" && encodedData) {
			const data = decodeSessionData(encodedData, completeDataSchema)
			if (data) {
				return { phase: "complete", data }
			}
		}

		restart()
		return { phase: "landing" }
	}, [phase, encodedData, restart])

	const getUpdatedUrl = useCallback((newPhase: string | undefined, newData: string | undefined) => {
		const searchParams = new URLSearchParams()
		if (newPhase) searchParams.append("phase", newPhase)
		if (newData) searchParams.append("data", newData)
		const queryString = searchParams.toString()
		return queryString ? `/learning?${queryString}` : "/learning"
	}, [])

	const startSession = useCallback(
		(items: LearnItemApiResponse[]) => {
			if (items.length === 0) return

			const data: SessionData = {
				items: items.map(toLearnItem),
				currentIndex: 0,
				results: [],
			}
			const encoded = encodeSessionData(data)
			const url = getUpdatedUrl("session", encoded)
			setPhase("session", url, { scroll: false })
			setEncodedData(encoded, url, { scroll: false })
		},
		[setPhase, setEncodedData, getUpdatedUrl],
	)

	const submitReview = useCallback(
		(correct: boolean, translationId: number) => {
			if (state.phase !== "session") return

			const { items, currentIndex, results } = state.data
			const newResults = [...results, { translationId, correct }]

			if (currentIndex >= items.length - 1) {
				const completeData: CompleteData = {
					results: newResults,
					totalItems: items.length,
				}
				const encoded = encodeSessionData(completeData)
				const url = getUpdatedUrl("complete", encoded)
				setPhase("complete", url, { scroll: false })
				setEncodedData(encoded, url, { scroll: false })
			} else {
				const sessionData: SessionData = {
					items,
					currentIndex: currentIndex + 1,
					results: newResults,
				}
				const encoded = encodeSessionData(sessionData)
				const url = getUpdatedUrl("session", encoded)
				setEncodedData(encoded, url, { scroll: false })
			}
		},
		[state, setPhase, setEncodedData, getUpdatedUrl],
	)

	const completeSession = useCallback(() => {
		if (state.phase !== "session") return

		const completeData: CompleteData = {
			results: state.data.results,
			totalItems: state.data.items.length,
		}
		const encoded = encodeSessionData(completeData)
		const url = getUpdatedUrl("complete", encoded)
		setPhase("complete", url, { scroll: false })
		setEncodedData(encoded, url, { scroll: false })
	}, [state, setPhase, setEncodedData, getUpdatedUrl])

	const actions = useMemo<LearningSessionActions>(
		() => ({
			startSession,
			submitReview,
			completeSession,
			restart,
		}),
		[startSession, submitReview, completeSession, restart],
	)

	return { state, actions }
}
