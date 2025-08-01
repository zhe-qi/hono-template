/**
 * 将下划线分隔的字符串转换为小驼峰格式
 * @param str 下划线分隔的字符串
 * @returns 小驼峰格式的字符串
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * 格式化单条连接查询结果，处理表别名或将表名转换为小驼峰格式并展平主表数据
 * @param record 单条记录
 * @param mainTableName 主表名
 * @param tableAliases 表别名映射 (表名 -> 别名)
 * @returns 格式化后的记录
 */
export function formatJoinRecord<T = Record<string, any>>(
  record: Record<string, any>,
  mainTableName: string,
  tableAliases?: Record<string, string>,
): T {
  if (!record || typeof record !== "object") {
    return {} as T;
  }

  // 获取主表数据
  const mainTableData = record[mainTableName] || {};
  const result = { ...mainTableData };

  // 处理关联表数据
  for (const [tableName, tableData] of Object.entries(record)) {
    if (tableName === mainTableName || tableData === null) {
      continue;
    }

    // 如果有别名映射，使用别名，否则转换表名为小驼峰格式
    const alias = tableAliases?.[tableName];
    const propName = alias || toCamelCase(tableName);
    result[propName] = tableData;
  }

  return result as T;
}

/**
 * 格式化分页查询结果，处理表别名或将表名转换为小驼峰格式并展平主表数据
 * @param data 查询结果数组
 * @param mainTableName 主表名
 * @param tableAliases 表别名映射 (表名 -> 别名)
 * @returns 格式化后的结果数组
 */
export function formatJoinResults<T = Record<string, any>>(
  data: Record<string, any>[],
  mainTableName: string,
  tableAliases?: Record<string, string>,
): T[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(record => formatJoinRecord<T>(record, mainTableName, tableAliases));
}
