import { index, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tsOperationLog = pgTable("ts_operation_log", {
  id: uuid().$defaultFn(() => crypto.randomUUID()),
  userId: uuid().notNull(),
  username: text().notNull(),
  domain: text().notNull(),
  moduleName: text().notNull(),
  description: text().notNull(),
  requestId: text().notNull(),
  method: text().notNull(),
  url: text().notNull(),
  ip: text().notNull(),
  userAgent: text(),
  params: jsonb(),
  body: jsonb(),
  response: jsonb(),
  startTime: timestamp({ mode: "string", withTimezone: true }).notNull(), // 时间分区键
  endTime: timestamp({ mode: "string", withTimezone: true }).notNull(),
  duration: integer().notNull(),
  createdBy: text().notNull(),
  createdAt: timestamp({ mode: "string", withTimezone: true }).$defaultFn(() => new Date().toISOString()),
}, table => [
  // 复合主键：id + startTime（满足 TimescaleDB 分区要求）
  primaryKey({ columns: [table.id, table.startTime] }),
  // 优化时序查询的索引，减少索引数量以提升写入性能
  index("ts_operation_log_time_idx").on(table.startTime.desc()),
  index("ts_operation_log_user_time_idx").on(table.userId, table.startTime.desc()),
  index("ts_operation_log_domain_time_idx").on(table.domain, table.startTime.desc()),
  index("ts_operation_log_module_time_idx").on(table.moduleName, table.startTime.desc()),
]);

export const selectTsOperationLogSchema = createSelectSchema(tsOperationLog, {
  id: schema => schema.describe("日志ID"),
  userId: schema => schema.describe("用户ID"),
  username: schema => schema.describe("用户名"),
  domain: schema => schema.describe("域"),
  moduleName: schema => schema.describe("模块名称"),
  description: schema => schema.describe("操作描述"),
  requestId: schema => schema.describe("请求ID"),
  method: schema => schema.describe("HTTP方法"),
  url: schema => schema.describe("URL"),
  ip: schema => schema.describe("IP地址"),
  userAgent: schema => schema.describe("用户代理"),
  params: schema => schema.describe("查询参数"),
  body: schema => schema.describe("请求体"),
  response: schema => schema.describe("响应"),
  startTime: schema => schema.describe("开始时间"),
  endTime: schema => schema.describe("结束时间"),
  duration: schema => schema.describe("持续时间(ms)"),
});

export const insertTsOperationLogSchema = createInsertSchema(tsOperationLog, {
  username: schema => schema.min(1),
  domain: schema => schema.min(1),
  moduleName: schema => schema.min(1),
  description: schema => schema.min(1),
  requestId: schema => schema.min(1),
  method: schema => schema.regex(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/),
  url: schema => schema.min(1),
  ip: schema => schema.min(1),
  startTime: schema => schema,
  endTime: schema => schema,
  duration: schema => schema.min(0),
}).omit({
  id: true,
  createdAt: true,
});

export const patchTsOperationLogSchema = insertTsOperationLogSchema.partial();
