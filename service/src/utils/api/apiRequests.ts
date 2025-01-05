import { API_BASE_URL, HttpMethod } from "@app/utils/api/apiConstants";
import { getFetchOptions } from "@app/utils/api/apiHelpers";

export const apiPostAuthenticate = async (): Promise<any> =>
    fetch(
        `${API_BASE_URL}/authenticate`,
        getFetchOptions({
            method: HttpMethod.POST,
        })
    ).then((data) => data.json());
