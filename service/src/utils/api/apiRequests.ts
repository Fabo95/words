import { API_BASE_URL, HttpMethod } from "@app/utils/api/apiConstants";
import { getFetchOptions } from "@app/utils/api/apiHelpers";

export const apiPostAuthenticate = async (authCookieValue: string | undefined): Promise<any> =>
    fetch(
        `${API_BASE_URL}/authenticate`,
        getFetchOptions({
            method: HttpMethod.POST,
            // See: https://stackoverflow.com/questions/76274546/next-js-does-not-send-cookies-with-fetch-request-even-though-credentials-are-inc
            headers: authCookieValue ? { Cookie: `auth-cookie=${authCookieValue}` } : {},
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

export const apiPostUserCreate = async (body: {
    email: string;
    password: string;
    confirmPassword: string;
}): Promise<any> =>
    fetch(
        `${API_BASE_URL}/user/create`,
        getFetchOptions({
            body,
            method: HttpMethod.POST,
        })
    ).then(responseHandler);

export const apiPostUserCheck = async (body: { email: string }): Promise<any> =>
    fetch(
        `${API_BASE_URL}/user/check`,
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
