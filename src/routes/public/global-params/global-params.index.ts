import type { RouteConfig } from "@hono/zod-openapi";

import type { AppRouteHandler } from "@/types/lib";

import { createRouter } from "@/lib/create-app";

import * as handlers from "./global-params.handlers";
import * as routes from "./global-params.routes";

export const globalParams = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.get, handlers.get)
  .openapi(routes.batch, handlers.batch);

type RouteTypes = {
  [K in keyof typeof routes]: typeof routes[K];
};

export type GlobalParamsRouteHandlerType<T extends keyof RouteTypes> = AppRouteHandler<RouteTypes[T] & RouteConfig>;
