import * as process from "process";

export const API_BASE_URL =
    process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://api.wolkenassistent.de";

export const enum HttpMethod {
    CONNECT = "CONNECT",
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT",
    TRACE = "TRACE",
}
