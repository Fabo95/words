import { Page } from "@app/utils/routing/routingTypes";

export const LOGGED_IN_PAGES = Object.values(Page).filter((currentPage) => currentPage !== Page.AUTHENTICATION);
