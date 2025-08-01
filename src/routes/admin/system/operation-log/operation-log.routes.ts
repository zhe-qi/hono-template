import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { z } from "zod";

import { selectTsOperationLogSchema } from "@/db/schema";
import { PermissionAction, PermissionResource } from "@/lib/enums";
import { createPaginatedResultSchema, PaginationParamsSchema } from "@/lib/pagination";

const routePrefix = "/system/operation-log";
const tags = [`${routePrefix}（操作日志）`];

const operationLogQuerySchema = PaginationParamsSchema.extend({
  search: z.string().optional().describe("搜索关键词"),
});

/** 获取操作日志列表 */
export const list = createRoute({
  tags,
  method: "get",
  path: routePrefix,
  permission: {
    resource: PermissionResource.SYSTEM_OPERATION_LOG,
    action: PermissionAction.READ,
  },
  summary: "获取操作日志列表",
  request: {
    query: operationLogQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createPaginatedResultSchema(selectTsOperationLogSchema),
      "操作日志列表获取成功",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(operationLogQuerySchema),
      "参数验证失败",
    ),
  },
});
