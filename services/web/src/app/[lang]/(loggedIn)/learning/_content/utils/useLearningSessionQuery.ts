"use client"

import { useCallback, useMemo } from "react"
import { z } from "zod"
import { useSearchParamState } from "@app/utils/urls/useSearchParamState"
import { LearnItem, LearnItemApiResponse, learnItemSchema } from "@app/utils/types/api"

// ============================================================================
// Schemas
// ============================================================================

const reviewGradeSchema = z.enum(["again", "hard", "good", "easy"])

const reviewResultSchema = z.object({
	translationId: z.number(),
	grade: reviewGradeSchema,
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

// ============================================================================
// Types
// ============================================================================

export type ReviewGrade = z.infer<typeof reviewGradeSchema>
type ReviewResult = z.infer<typeof reviewResultSchema>
type SessionData = z.infer<typeof sessionDataSchema>
type CompleteData = z.infer<typeof completeDataSchema>

export type LearningSessionState =
	| { phase: "landing" }
	| { phase: "session"; data: SessionData }
	| { phase: "complete"; data: CompleteData }

export type LearningSessionActions = {
	startSession: (items: LearnItemApiResponse[]) => void
	submitReview: (grade: ReviewGrade, translationId: number) => void
	completeSession: () => void
	restart: () => void
}

// ============================================================================
// URL Encoding
// ============================================================================

function toUrlSafeBase64(str: string): string {
	return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromUrlSafeBase64(str: string): string {
	let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
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
		return schema.parse(JSON.parse(fromUrlSafeBase64(encoded)))
	} catch {
		return null
	}
}

// ============================================================================
// Transformers
// ============================================================================

function toLearnItem(item: LearnItemApiResponse): LearnItem {
	return {
		id: item.id,
		sourceText: item.source_text,
		targetText: item.target_text,
		isNew: item.is_new,
	}
}

function buildUrl(phase: string | undefined, data: string | undefined): string {
	const params = new URLSearchParams()
	if (phase) params.append("phase", phase)
	if (data) params.append("data", data)
	const query = params.toString()
	return query ? `/learning?${query}` : "/learning"
}

// ============================================================================
// State Parser
// ============================================================================

function parseState(phase: string | undefined, encodedData: string | undefined): LearningSessionState | null {
	if (phase === "session" && encodedData) {
		const data = decodeSessionData(encodedData, sessionDataSchema)
		if (data?.items.length) {
			return { phase: "session", data }
		}
	}

	if (phase === "complete" && encodedData) {
		const data = decodeSessionData(encodedData, completeDataSchema)
		if (data) {
			return { phase: "complete", data }
		}
	}

	return null
}

// ============================================================================
// Hook
// ============================================================================

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
		const parsed = parseState(phase, encodedData)
		if (parsed) return parsed

		if (phase || encodedData) {
			restart()
		}
		return { phase: "landing" }
	}, [phase, encodedData, restart])

	const startSession = useCallback(
		(items: LearnItemApiResponse[]) => {
			if (!items.length) return

			const data: SessionData = {
				items: items.map(toLearnItem),
				currentIndex: 0,
				results: [],
			}
			const encoded = encodeSessionData(data)
			const url = buildUrl("session", encoded)
			setPhase("session", url, { scroll: false })
			setEncodedData(encoded, url, { scroll: false })
		},
		[setPhase, setEncodedData],
	)

	const submitReview = useCallback(
		(grade: ReviewGrade, translationId: number) => {
			if (state.phase !== "session") return

			const { items, currentIndex, results } = state.data
			const newResults: ReviewResult[] = [...results, { translationId, grade }]
			const isLastItem = currentIndex >= items.length - 1

			if (isLastItem) {
				const data: CompleteData = { results: newResults, totalItems: items.length }
				const encoded = encodeSessionData(data)
				const url = buildUrl("complete", encoded)
				setPhase("complete", url, { scroll: false })
				setEncodedData(encoded, url, { scroll: false })
			} else {
				const data: SessionData = { items, currentIndex: currentIndex + 1, results: newResults }
				const encoded = encodeSessionData(data)
				setEncodedData(encoded, buildUrl("session", encoded), { scroll: false })
			}
		},
		[state, setPhase, setEncodedData],
	)

	const completeSession = useCallback(() => {
		if (state.phase !== "session") return

		const data: CompleteData = { results: state.data.results, totalItems: state.data.items.length }
		const encoded = encodeSessionData(data)
		const url = buildUrl("complete", encoded)
		setPhase("complete", url, { scroll: false })
		setEncodedData(encoded, url, { scroll: false })
	}, [state, setPhase, setEncodedData])

	const actions = useMemo<LearningSessionActions>(
		() => ({ startSession, submitReview, completeSession, restart }),
		[startSession, submitReview, completeSession, restart],
	)

	return { state, actions }
}
