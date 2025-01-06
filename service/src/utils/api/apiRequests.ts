import { API_BASE_URL, HttpMethod } from "@app/utils/api/apiConstants";
import { getFetchOptions } from "@app/utils/api/apiHelpers";

export const apiPostAuthenticate = async (): Promise<any> =>
    fetch(
        `${API_BASE_URL}/authenticate`,
        getFetchOptions({
            method: HttpMethod.POST,
        })
    ).then((data) => data.json());

export const apiPostUserLogin = async (body: { email: string; password: string }): Promise<any> =>
    fetch(
        `${API_BASE_URL}/user/login`,
        getFetchOptions({
            body,
            method: HttpMethod.POST,
        })
    ).then(responseHandler);

export const responseHandler = (response: Response) => {
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(response);
};
