import { PageContent } from "@app/components/ui/pageContent"
import { Spinner } from "@app/components/ui/spinner"

export default function Loading() {
	return (
		<PageContent className="flex justify-center items-center h-full">
			<Spinner className="size-5" />
		</PageContent>
	)
}
