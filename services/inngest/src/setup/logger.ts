import jwt from 'jsonwebtoken'
import { pino } from 'pino'

export const logger = pino({
    messageKey: 'message',
    // using process.env here to avoid circular dependency
    ...(process.env.ENVIRONMENT === 'development'
        ? {
              transport: {
                  target: 'pino-pretty',
                  options: {
                      translateTime: 'SYS:dd.mm.yyyy HH:MM:ss',
                      colorize: true,
                      ignore: 'pid,hostname',
                  },
              },
          }
        : {}),
    serializers: {
        res(res) {
            const path = res.request?.routeOptions?.url
            return {
                statusCode: res.statusCode,
                url: res.request?.url,
                path: path ? `${res.request.method} ${path}` : `not found`,
            }
        },
        req(req) {
            const authHeader = req.headers['authorization']
            const jwtPayload = authHeader ? jwt.decode(authHeader.split(' ')[1]) : null

            const path = req.routeOptions?.url

            return {
                method: req.method,
                url: req.url,
                path: path ? `${req.method} ${path}` : `not found`,
                parameters: req.parameters,
                headers: {
                    acceptLanguage: req.headers['accept-language'],
                    'x-app-version': req.headers['x-app-version'],
                    mobilePlatform: req.headers['mobileplatform'],
                },

                jwtInfoNotVerified: authHeader
                    ? jwtPayload
                        ? typeof jwtPayload === 'string'
                            ? { err: `JWT Payload is a string: ${jwtPayload}` }
                            : {
                                  id: jwtPayload.id,
                                  confirmed: jwtPayload.confirmed,
                                  role: jwtPayload.role,
                                  iss: jwtPayload.iss,
                              }
                        : { err: 'Could not decode JWT payload' }
                    : { err: `No 'authorization' Header` },
            }
        },
    },
})
