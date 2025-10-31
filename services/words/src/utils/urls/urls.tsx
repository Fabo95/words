import { Page } from "@app/utils/types/pageTypes"

export const getCollectionPage = (id: number): string => {
	return `/${Page.COLLECTION}/${id}`
}
