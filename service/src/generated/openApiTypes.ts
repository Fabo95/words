/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export type paths = {
    "/authenticate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["authentication_handler"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["create_collection_handler"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collection/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["find_all_collections_handler"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/translation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["create_translation_handler"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/translation/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["find_all_translations_handler"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/translation/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["find_one_translation_handler"];
        put?: never;
        post?: never;
        delete: operations["delete_translation_handler"];
        options?: never;
        head?: never;
        patch: operations["update_translation_handler"];
        trace?: never;
    };
    "/user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["find_one_user_by_id_handler"];
        put?: never;
        post: operations["create_user_handler"];
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["update_user_handler"];
        trace?: never;
    };
    "/user/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["check_email_handler"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["login_handler"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["logout_handler"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        AuthenticationResponse: {
            isAuthenticated: boolean;
        };
        CollectionForCreate: {
            name: string;
        };
        EmailForCheck: {
            email: string;
        };
        EmailForCheckResponse: {
            isEmailValid: boolean;
        };
        HttpResponseBody_AuthenticationResponse: {
            message: string;
            response_object?: {
                isAuthenticated: boolean;
            };
            success: boolean;
        };
        HttpResponseBody_EmailForCheckResponse: {
            message: string;
            response_object?: {
                isEmailValid: boolean;
            };
            success: boolean;
        };
        HttpResponseBody_UserForResponse: {
            message: string;
            response_object?: {
                email: string;
                /** Format: int32 */
                id: number;
                name?: string | null;
            };
            success: boolean;
        };
        "HttpResponseBody_Vec_entity.collectionsModel": {
            message: string;
            response_object?: {
                /** Format: int32 */
                id: number;
                name: string;
                /** Format: int32 */
                user_id: number;
            }[];
            success: boolean;
        };
        "HttpResponseBody_Vec_entity.translationsModel": {
            message: string;
            response_object?: {
                /** Format: int32 */
                id: number;
                source_language: string;
                source_text: string;
                target_language: string;
                target_text: string;
                /** Format: int32 */
                user_id: number;
            }[];
            success: boolean;
        };
        "HttpResponseBody_entity.collectionsModel": {
            message: string;
            response_object?: {
                /** Format: int32 */
                id: number;
                name: string;
                /** Format: int32 */
                user_id: number;
            };
            success: boolean;
        };
        "HttpResponseBody_entity.translationsModel": {
            message: string;
            response_object?: {
                /** Format: int32 */
                id: number;
                source_language: string;
                source_text: string;
                target_language: string;
                target_text: string;
                /** Format: int32 */
                user_id: number;
            };
            success: boolean;
        };
        HttpResponseBody_u64: {
            message: string;
            /** Format: int64 */
            response_object?: number;
            success: boolean;
        };
        TranslationForCreate: {
            source_language: string;
            source_text: string;
            target_language: string;
            target_text: string;
        };
        TranslationForUpdate: {
            source_language?: string | null;
            source_text?: string | null;
            target_language?: string | null;
            target_text?: string | null;
        };
        UserForCreate: {
            confirmPassword: string;
            email: string;
            password: string;
        };
        UserForLogin: {
            email: string;
            password: string;
        };
        UserForResponse: {
            email: string;
            /** Format: int32 */
            id: number;
            name?: string | null;
        };
        UserForUpdate: {
            confirmPassword?: string | null;
            name?: string | null;
            password?: string | null;
        };
        "entity.collectionsModel": {
            /** Format: int32 */
            id: number;
            name: string;
            /** Format: int32 */
            user_id: number;
        };
        "entity.translationsModel": {
            /** Format: int32 */
            id: number;
            source_language: string;
            source_text: string;
            target_language: string;
            target_text: string;
            /** Format: int32 */
            user_id: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    authentication_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_AuthenticationResponse"];
                };
            };
        };
    };
    create_collection_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CollectionForCreate"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_entity.collectionsModel"];
                };
            };
        };
    };
    find_all_collections_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_Vec_entity.collectionsModel"];
                };
            };
        };
    };
    create_translation_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TranslationForCreate"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_entity.translationsModel"];
                };
            };
        };
    };
    find_all_translations_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_Vec_entity.translationsModel"];
                };
            };
        };
    };
    find_one_translation_handler: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_entity.translationsModel"];
                };
            };
        };
    };
    delete_translation_handler: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_u64"];
                };
            };
        };
    };
    update_translation_handler: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TranslationForUpdate"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_entity.translationsModel"];
                };
            };
        };
    };
    find_one_user_by_id_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_UserForResponse"];
                };
            };
        };
    };
    create_user_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserForCreate"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_UserForResponse"];
                };
            };
        };
    };
    update_user_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserForUpdate"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_UserForResponse"];
                };
            };
        };
    };
    check_email_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailForCheck"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_EmailForCheckResponse"];
                };
            };
        };
    };
    login_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserForLogin"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpResponseBody_UserForResponse"];
                };
            };
        };
    };
    logout_handler: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
