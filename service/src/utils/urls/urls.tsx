import { Page } from "@app/utils/routing/routingTypes"

export const getCollectionPage = (id: number): string => {
	return `/${Page.COLLECTION}/${id}`
}
