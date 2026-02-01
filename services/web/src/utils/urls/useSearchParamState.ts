"use client"

import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { flushSync } from "react-dom"

type IOptimisticUrlSetState<T> = (newValue: T | undefined, nextUrl: string, navigateOptions?: NavigateOptions) => void

export function useSearchParamState<T extends number | string | boolean | string[]>(
	key: string,
	urlType: "search" | "path",
	type: T extends string ? "string" : T extends number ? "number" : T extends boolean ? "boolean" : "array",
	method: "replace" | "push",
): [T | undefined, IOptimisticUrlSetState<T>] {
	const rawValue = useUrlParam(key, urlType)

	const value = useMemo(() => {
		if (!rawValue) return undefined

		if (type === "array") {
			return rawValue.split(",")
		}

		if (type === "number") {
			const rawNumber = Number(rawValue)

			if (Number.isNaN(rawNumber)) return undefined

			return rawNumber
		}

		if (type === "boolean") {
			if (rawValue === "true") return true as unknown as T
			if (rawValue === "false") return false as unknown as T
			return undefined
		}

		return rawValue
	}, [rawValue, type])

	const [state, setState] = useState<T | undefined>(value as T | undefined)

	useEffect(() => {
		setState(value as T | undefined)
	}, [value])

	const optimisticSetState = useOptimisticUrlSetState<T>(method, setState)

	return useMemo(() => [state, optimisticSetState] as const, [state, optimisticSetState])
}

/**
 * Returns a functino which accepts a function to update the URL and returns a function to update the state
 * The state is updated and flushed immediately, and the URL is updated after the state is updated
 */
function useOptimisticUrlSetState<T>(
	method: "replace" | "push",
	setState: (newValue: T | undefined) => void,
): IOptimisticUrlSetState<T> {
	const router = useRouter()

	return useCallback(
		(newValue, nextUrl, navigateOptions) => {
			setState(newValue)

			switch (method) {
				case "replace":
					router.replace(nextUrl, navigateOptions)
					break

				case "push":
					router.push(nextUrl, navigateOptions)
					break
			}
		},
		[setState, router, method],
	)
}

export const useUrlParam = (key: string, urlType: "search" | "path") => {
	const searchParams = useSearchParams()
	const pathParams = useParams()

	return useMemo(() => {
		const rawCurrentUrlValue = (urlType === "search" ? searchParams.get(key) : (pathParams[key] as string)) ?? undefined

		if (!rawCurrentUrlValue) return undefined

		return decodeURIComponent(rawCurrentUrlValue)
	}, [key, pathParams, searchParams, urlType])
}
