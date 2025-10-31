"use client"

import { Box } from "services/words/src/components/ui/box"
import { Button } from "services/words/src/components/ui/button"
import { Text } from "services/words/src/components/ui/text"
import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<Box className="justify-center pt-16 items-center">
			<Text className="text-neutral-100 text-sm mb-5">Something went wrong!</Text>

			<Button onClick={() => reset()}>Try again</Button>
		</Box>
	)
}
