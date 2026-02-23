import { $api } from "@app/utils/api/apiRequests"

/**
 * Query options for fetching data.
 * Auth is handled by middleware:
 * - Server: setSSRAuthCookie() sets cookie, middleware injects it
 * - Client: credentials: "include" sends cookies automatically
 *
 * IMPORTANT: Do NOT add headers here - it changes the queryKey and breaks SSR hydration!
 */

export const getLatestTranslationsQueryOptions = () =>
	$api.queryOptions("get", "/translation", {
		params: {
			query: {
				page_size: 3,
				sort_by: "created_at",
				sort_order: "desc",
			},
		},
	})

export const getCollectionsQueryOptions = () => $api.queryOptions("get", "/collection/wip1", {})

export const getCefrLevelsQueryOptions = () => ({
	...$api.queryOptions("get", "/cefr-levels", {}),
	staleTime: Number.POSITIVE_INFINITY,
})

export const getUniversalPosTagsQueryOptions = () => ({
	...$api.queryOptions("get", "/universal-pos-tags", {}),
	staleTime: Number.POSITIVE_INFINITY,
})

export const getUserQueryOptions = () => $api.queryOptions("get", "/user", {})

export const getTranslationsQueryOptions = (args: { page: number; pageSize: number; search?: string }) =>
	$api.queryOptions("get", "/translation", {
		params: {
			query: {
				page: args.page,
				page_size: args.pageSize,
				search: args.search,
			},
		},
	})

export const getCollectionTranslationsQueryOptions = (args: {
	id: number
	page: number
	pageSize: number
	search?: string
}) =>
	$api.queryOptions("get", "/collection/{id}/translations", {
		params: {
			path: { id: args.id },
			query: {
				page: args.page,
				page_size: args.pageSize,
				search: args.search,
			},
		},
	})

export const getCollectionByIdQueryOptions = (id: number) =>
	$api.queryOptions("get", "/collection/wip2/{id}", {
		params: { path: { id } },
	})

export const getTranslationByIdQueryOptions = (id: number) =>
	$api.queryOptions("get", "/translation/wip2/{id}", {
		params: { path: { id } },
	})

export const getTranslationStatisticsQueryOptions = () => $api.queryOptions("get", "/translation/statistics", {})

export const getLearnItemsQueryOptions = (args: { limit?: number; collection_id?: number; include_new?: boolean }) =>
	$api.queryOptions("get", "/learn", {
		params: {
			query: {
				limit: args.limit,
				collection_id: args.collection_id,
				include_new: args.include_new,
			},
		},
	})

export const getLearnStatsQueryOptions = (args?: { collectionId?: number | null }) =>
	$api.queryOptions("get", "/learn/stats", {
		params: {
			query: {
				...(args?.collectionId ? { collection_id: args.collectionId } : {}),
			},
		},
	})

export const getDailyGoalsQueryOptions = () => $api.queryOptions("get", "/daily-goals", {})

export const getDailyStatisticsQueryOptions = (args: { days?: number }) =>
	$api.queryOptions("get", "/daily-statistics", {
		params: {
			query: {
				days: args.days ?? 7,
			},
		},
	})
