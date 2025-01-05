import { HttpMethod } from "@app/utils/api/apiConstants";

type GetFetchOptions = Omit<RequestInit, "body"> & {
    body?: {
        [key: string]: unknown;
    };
    headers?: RequestInit["headers"];
    method?: HttpMethod;
};

export const getFetchOptions = ({
    body,
    cache,
    headers,
    method = HttpMethod.GET,
    ...options
}: GetFetchOptions = {}): RequestInit => ({
    method,
    body: JSON.stringify(body),
    cache: cache || "no-cache",
    headers: {
        "Content-Type": "application/json",
        ...headers,
    },
    ...options,
});
