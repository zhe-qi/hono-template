import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import {
  batchGetGlobalParamsSchema,
  responseGlobalParamsSchema,
} from "@/db/schema";
import { notFoundSchema } from "@/lib/enums";

const tags = ["/global-params (全局参数)"];

/** 参数键路径模式 */
const KeyParamsSchema = z.object({
  key: z.string().min(1, "参数键不能为空").describe("参数键名"),
});

/** 获取全局参数列表 */
export const list = createRoute({
  tags,
  summary: "获取全局参数列表",
  method: "get",
  path: "/global-params",
  request: {
    query: z.object({
      publicOnly: z.enum(["true", "false"]).optional().default("true").describe("是否只获取公开参数"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(responseGlobalParamsSchema),
      "获取全局参数列表成功",
    ),
  },
});

/** 获取单个全局参数 */
export const get = createRoute({
  tags,
  summary: "获取单个全局参数",
  method: "get",
  path: "/global-params/{key}",
  request: {
    params: KeyParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      responseGlobalParamsSchema,
      "获取参数成功",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createErrorSchema(KeyParamsSchema),
      "参数键格式错误",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "参数不存在或不是公开参数",
    ),
  },
});

/** 批量获取全局参数 */
export const batch = createRoute({
  tags,
  summary: "批量获取全局参数",
  method: "post",
  path: "/global-params/batch",
  request: {
    query: z.object({
      publicOnly: z.enum(["true", "false"]).optional().default("true").describe("是否只获取公开参数"),
    }),
    body: jsonContentRequired(
      batchGetGlobalParamsSchema,
      "批量获取参数",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.record(z.string(), responseGlobalParamsSchema.nullable()),
      "批量获取成功，key-value形式返回，不存在的参数返回null",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createErrorSchema(batchGetGlobalParamsSchema),
      "请求参数错误",
    ),
  },
});
