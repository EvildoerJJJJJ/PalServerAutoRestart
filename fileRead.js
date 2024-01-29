/*
 * @Author: EvildoerJJJ 1226898761@qq.com
 * @Date: 2024-01-28 13:32:10
 * @LastEditors: EvildoerJJJ 1226898761@qq.com
 * @LastEditTime: 2024-01-29 13:46:57
 * @Description:
 */
const fs = require("fs");
const path = require("path");
const configJsonPath = path.resolve(__dirname, "./config.json");
/**
 * @description: 读取
 * @return {*}
 */
function fileRead() {
  const data = JSON.parse(fs.readFileSync(configJsonPath, "utf8"));
  return { data };
}
module.exports = fileRead();
