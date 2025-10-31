import { Page } from "services/words/src/utils/types/pageTypes"

export const getCollectionPage = (id: number): string => {
	return `/${Page.COLLECTION}/${id}`
}
