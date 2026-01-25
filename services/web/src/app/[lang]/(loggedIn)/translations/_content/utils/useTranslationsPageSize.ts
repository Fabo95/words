"use client"

import { useCallback, useEffect, useState } from "react"
import { useIsMobile } from "@app/hooks/use-mobile"

const MIN_PAGE_SIZE = 5

// Estimated heights in pixels
const DESKTOP_ROW_HEIGHT = 50
const MOBILE_CARD_HEIGHT = 150

const DESKTOP_FIXED_HEIGHT = 450
const MOBILE_FIXED_HEIGHT = 450

export function useTranslationsPageSize(): number {
	const isMobile = useIsMobile()

	const calculatePageSize = useCallback(() => {
		if (typeof window === "undefined") {
			return MIN_PAGE_SIZE
		}

		const viewportHeight = window.innerHeight
		const fixedHeight = isMobile ? MOBILE_FIXED_HEIGHT : DESKTOP_FIXED_HEIGHT
		const rowHeight = isMobile ? MOBILE_CARD_HEIGHT : DESKTOP_ROW_HEIGHT

		const availableHeight = viewportHeight - fixedHeight
		const calculatedSize = Math.floor(availableHeight / rowHeight)

		console.log("availableHeight", availableHeight)

		return isMobile ? MIN_PAGE_SIZE : Math.max(calculatedSize, MIN_PAGE_SIZE)
	}, [isMobile])

	const [pageSize, setPageSize] = useState(calculatePageSize)

	useEffect(() => {
		const set = () => {
			setPageSize(calculatePageSize())
		}

		window.addEventListener("resize", set)
		return () => window.removeEventListener("resize", set)
	}, [calculatePageSize])

	return pageSize
}
