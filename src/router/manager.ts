import { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { RequestSchema, ResponseSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { HttpMethod } from "@src/http/constants";
import logger from "@src/log/logger";
import { isDefined } from "@src/util/common";
import { IllegalStateError } from "@src/api/error/illegal-state-error";

export class RouteManager {

    private constructor() {}

    public static registerRoutes(server: FastifyInstance, providers: RouteProvider<unknown, unknown>[]): void {
        for (const provider of providers) {
            this.registerRoute(server, provider.provide() as RouteDefinition<unknown, unknown>);
        }
    }

    private static registerRoute(server: FastifyInstance, route: RouteDefinition<unknown, unknown>): void {
        server.route({
            method: route.method,
            url: route.path,
            schema: RouteManager.convertRequestSchema(route.schema),
            handler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                const body = RouteManager.mergeRequestContext(request) as unknown;

                try {
                    const response = await route.handler.handle(body);
                    this.sendSuccessResponse(reply, route, response);
                } catch (ex) {
                    if (ex instanceof IllegalStateError) {
                        this.sendErrorResponse(reply, route, 400, ex);
                        return;
                    }

                    console.error(ex);
                    logger.error(`Error while handling ${route.path} (${route.name}): ${ex}`);
                    this.sendErrorResponse(reply, route, 500, ex);
                }
            },
        })
    }

    private static sendSuccessResponse(reply: FastifyReply, route: RouteDefinition<unknown, unknown>, responseBody: unknown): void {
        const statusCode = isDefined(route.response?.statusCode) ? (route.response as ResponseSchema).statusCode : this.getCodeFromMethod(route.method, !responseBody);

        reply
            .code(statusCode)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(responseBody);
    }

    private static sendErrorResponse(reply: FastifyReply, route: RouteDefinition<unknown, unknown>, statusCode: number | undefined, ex: unknown) {
        const errorMessage = (ex as any)?.message || "An error occurred";
        const code = statusCode || 500;

        reply
            .code(code)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ message: errorMessage });
    }

    private static getCodeFromMethod(method: HttpMethod, isResponseBodyEmpty: boolean): number {
        if (isResponseBodyEmpty) {
            return 204;
        }

        if (method === "POST") {
            return 201;
        }

        return 200;
    }

    private static convertRequestSchema(schema: RequestSchema): FastifySchema {
        let requestSchema = {};

        if (isDefined(schema.body)) {
            requestSchema = { ...requestSchema, body: { ...schema.body as object } };
        }

        if (isDefined(schema.params)) {
            requestSchema = { ...requestSchema, params: { ...schema.params as object } };
        }

        if (isDefined(schema.querystring)) {
            requestSchema = { ...requestSchema, querystring: { ...schema.querystring as object } };
        }

        return requestSchema;
    }

    private static mergeRequestContext(request: FastifyRequest): unknown {
        let requestContext = {};

        if (typeof request.body === 'object') {
            requestContext = { ...requestContext, ...request.body };
        }

        if (typeof request.query === 'object') {
            requestContext = { ...requestContext, ...request.query };
        }

        if (typeof request.params === 'object') {
            requestContext = { ...requestContext, ...request.params,  };
        }

        return requestContext;
    }

}

