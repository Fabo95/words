"use client"

import { Box } from "@app/components/ui/box"
import { Button } from "@app/components/ui/button"
import { Text } from "@app/components/ui/text"
import { useEffect } from "react"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<Box className="justify-center pt-16 items-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
				<AlertCircle className="h-8 w-8 text-destructive" />
			</div>
			<Text className="text-neutral-100 text-sm mb-5">Something went wrong!</Text>

			<Button onClick={() => reset()}>
				<RotateCcw className="h-4 w-4 mr-2" />
				Try again
			</Button>
		</Box>
	)
}
