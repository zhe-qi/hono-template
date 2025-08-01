import * as HttpStatusCodes from "stoker/http-status-codes";

import * as globalParamsService from "@/services/system/global-params";

import type { GlobalParamsRouteHandlerType } from "./global-params.index";

export const list: GlobalParamsRouteHandlerType<"list"> = async (c) => {
  const { publicOnly } = c.req.valid("query");

  const result = await globalParamsService.getPublicList({
    publicOnly,
  });

  return c.json(result, HttpStatusCodes.OK);
};

export const get: GlobalParamsRouteHandlerType<"get"> = async (c) => {
  const { key } = c.req.valid("param");

  const param = await globalParamsService.getPublicParam(key);

  if (!param) {
    return c.json({ message: "参数不存在或不是公开参数" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(param, HttpStatusCodes.OK);
};

export const batch: GlobalParamsRouteHandlerType<"batch"> = async (c) => {
  const { keys } = c.req.valid("json");
  const { publicOnly } = c.req.valid("query");

  const result = await globalParamsService.batchGetParams(keys, {
    publicOnly,
  });

  return c.json(result, HttpStatusCodes.OK);
};
