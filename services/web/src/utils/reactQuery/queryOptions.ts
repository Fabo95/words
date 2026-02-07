import { $api } from "@app/utils/api/apiRequests"

export const getLatestTranslationsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/translation", {
		params: {
			query: {
				page_size: 3,
				sort_by: "created_at",
				sort_order: "desc",
			},
		},
		// only attach Cookie header when we have it (server)
		...(authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}),
	})

export const getCollectionsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/collection/wip1", {
		...(authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}),
	})

export const getCefrLevelsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/cefr-levels", {
		...(authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}),
	})

export const getUniversalPosTagsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/universal-pos-tags", {
		...(authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}),
	})

export const getUserQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/user", {
		...(authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}),
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
		...(args.authCookieValue ? { headers: { Cookie: `auth-cookie=${args.authCookieValue}` } } : {}),
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
		...(args.authCookieValue ? { headers: { Cookie: `auth-cookie=${args.authCookieValue}` } } : {}),
	})

export const getCollectionByIdQueryOptions = (id: number, authCookieValue?: string) =>
	$api.queryOptions("get", "/collection/wip2/{id}", {
		params: { path: { id } },
		...(authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}),
	})

export const getTranslationByIdQueryOptions = (id: number) =>
	$api.queryOptions("get", "/translation/wip2/{id}", {
		params: { path: { id } },
	})

export const getTranslationStatisticsQueryOptions = (authCookieValue?: string) =>
	$api.queryOptions("get", "/translation/statistics", {
		...(authCookieValue ? { headers: { Cookie: `auth-cookie=${authCookieValue}` } } : {}),
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
		...(args.authCookieValue ? { headers: { Cookie: `auth-cookie=${args.authCookieValue}` } } : {}),
	})

export const getLearnStatsQueryOptions = (args?: { collectionId?: number | null; authCookieValue?: string }) =>
	$api.queryOptions("get", "/learn/stats", {
		params: {
			query: {
				...(args?.collectionId ? { collection_id: args.collectionId } : {}),
			},
		},
		...(args?.authCookieValue ? { headers: { Cookie: `auth-cookie=${args.authCookieValue}` } } : {}),
	})
