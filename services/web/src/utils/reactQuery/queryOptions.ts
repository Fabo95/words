import { $api } from "@app/utils/api/apiRequests"

/**
 * Creates headers object with auth cookie for server-side requests.
 * Returns empty object for client-side requests where cookies are sent automatically.
 */
const withAuthCookie = (authCookieValue?: string) =>
	authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}

export const getLatestTranslationsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/translation", {
		params: {
			query: {
				page_size: 3,
				sort_by: "created_at",
				sort_order: "desc",
			},
		},
		...withAuthCookie(authCookieValue),
	})

export const getCollectionsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/collection/wip1", {
		...withAuthCookie(authCookieValue),
	})

export const getCefrLevelsQueryOptions = (authCookieValue?: string) => ({
	...$api.queryOptions("get", "/cefr-levels", {
		...withAuthCookie(authCookieValue),
	}),
	staleTime: Number.POSITIVE_INFINITY, // Reference data never changes
})

export const getUniversalPosTagsQueryOptions = (authCookieValue?: string) => ({
	...$api.queryOptions("get", "/universal-pos-tags", {
		...withAuthCookie(authCookieValue),
	}),
	staleTime: Number.POSITIVE_INFINITY, // Reference data never changes
})

export const getUserQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/user", {
		...withAuthCookie(authCookieValue),
	})

export const getTranslationsQueryOptions = (args: {
	page: number
	pageSize: number
	search?: string
	authCookieValue?: string
}) =>
	$api.queryOptions("get", "/translation", {
		params: {
			query: {
				page: args.page,
				page_size: args.pageSize,
				search: args.search,
			},
		},
		...withAuthCookie(args.authCookieValue),
	})

export const getCollectionTranslationsQueryOptions = (args: {
	id: number
	page: number
	pageSize: number
	search?: string
	authCookieValue?: string
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
		...withAuthCookie(args.authCookieValue),
	})

export const getCollectionByIdQueryOptions = (id: number, authCookieValue?: string) =>
	$api.queryOptions("get", "/collection/wip2/{id}", {
		params: { path: { id } },
		...withAuthCookie(authCookieValue),
	})

export const getTranslationByIdQueryOptions = (id: number) =>
	$api.queryOptions("get", "/translation/wip2/{id}", {
		params: { path: { id } },
	})

export const getTranslationStatisticsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/translation/statistics", {
		...withAuthCookie(authCookieValue),
	})

export const getLearnItemsQueryOptions = (args: {
	limit?: number
	collection_id?: number
	include_new?: boolean
	authCookieValue?: string
}) =>
	$api.queryOptions("get", "/learn", {
		params: {
			query: {
				limit: args.limit,
				collection_id: args.collection_id,
				include_new: args.include_new,
			},
		},
		...withAuthCookie(args.authCookieValue),
	})

export const getLearnStatsQueryOptions = (args?: { collectionId?: number | null; authCookieValue?: string }) =>
	$api.queryOptions("get", "/learn/stats", {
		params: {
			query: {
				...(args?.collectionId ? { collection_id: args.collectionId } : {}),
			},
		},
		...withAuthCookie(args?.authCookieValue),
	})

export const getDailyGoalsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/daily-goals", {
		...withAuthCookie(authCookieValue),
	})

export const getDailyStatisticsQueryOptions = (args: { days?: number; authCookieValue?: string }) =>
	$api.queryOptions("get", "/daily-statistics", {
		params: {
			query: {
				days: args.days ?? 7,
			},
		},
		...withAuthCookie(args.authCookieValue),
	})
