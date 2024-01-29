/*
 * @Author: EvildoerJJJ 1226898761@qq.com
 * @Date: 2024-01-28 00:38:45
 * @LastEditors: EvildoerJJJ 1226898761@qq.com
 * @LastEditTime: 2024-01-29 16:52:29
 * @Description:
 */
const cmd = process.platform == "win32" ? "tasklist" : "ps aux";
const { exec, spawn } = require("child_process");
const iconv = require("iconv-lite");

const configData = require("./fileRead").data;
const processName = configData.PalServerName;
const processCMDName = configData.processCMDName || processName;
const PalServerPath = JSON.stringify(configData.PalServerPath)
  .replace(/\"/g, "")
  .replace(/\\\\/g, "\\")
  .concat(`\\${processName}.exe`);
const msg = {
  success: { res: "成功", date: new Date(), code: 0, description: `` },
  fail: {
    res: "失败",
    date: new Date(),
    code: 1,
    description: ``,
  },
};

/**
 * @description: 检查进程是否进行中
 * @param {*} query 进程名
 * @param {*} cb 执行函数
 * @return {*}
 */
const isRunning = (query, cb) => {
  exec(cmd, { encoding: "buffer" }, function (err, stdout, stderr) {
    const res = {
      exist: false,
      processData: [],
      err: "",
    };
    if (err) {
      res.err = err;
      cb(res);
      return console.log(err);
    }
    iconv
      .decode(stdout, "gbk")
      .split("\n")
      .map(function (line) {
        const p = line.trim().split(/\s+/),
          pname = p[0],
          pid = p[1];
        if (pname.toLowerCase().indexOf(query) >= 0 && parseInt(pid)) {
          res.exist = true;
          const temp = {
            pname,
            pid,
            ram: p[4],
            unit: p[5],
          };
          res.processData.push(temp);
        }
      });
    cb(res);
  });
};

/**
 * @description: 启动服务器
 * @param {*}
 * @param {*}
 * @return {*}
 */
const startPalServer = () => {
  return new Promise((resolve, reject) => {
    isRunning(processCMDName, (res) => {
      if (res.exist)
        return resolve({ ...msg.fail, ...{ description: "启程已存在" } });
      // const order = `start "" ${PalServerPath}`;
      try {
        // execute(order);
        spawn(PalServerPath);
        resolve(msg.success);
      } catch (err) {
        reject({ ...msg.fail, ...{ description: err } });
      }
    });
  });
};

/**
 * @description: 结束服务器
 * @param {*}
 * @param {*}
 * @return {*}
 */
const endPalServer = () => {
  const killOrder = async (processData) => {
    await processData.map((item) => {
      process.kill(item.pid);
    });
  };
  return new Promise((resolve, reject) => {
    isRunning(processCMDName, (res) => {
      if (!res.exist) {
        console.log(msg.fail.description);
      }
      if (res.processData.length < 1) {
        return resolve(msg.fail);
      }
      try {
        killOrder(res.processData);
        return resolve(msg.success);
      } catch {
        reject({ ...msg.fail, ...{ description: err } });
      }
    });
  });
};

/**
 * @description: 重启服务器
 * @param {*}
 * @param {*}
 * @return {*}
 */
const restartPalServer = () => {
  return new Promise((resolve, reject) => {
    isRunning(processCMDName, (res) => {
      if (!res.exist) {
        return resolve({ ...msg.fail, ...{ description: "进程未启动" } });
      }
      try {
        endPalServer().then(() => {
          startPalServer().then(() => {
            resolve(msg.success);
          });
        });
      } catch (err) {
        reject({ ...msg.fail, ...{ description: err } });
      }
    });
  });
};

const watchingPalServer = (cb) => {
  isRunning(processCMDName, (res) => {
    cb(res);
  });
};

module.exports = {
  isRunning,
  startPalServer,
  endPalServer,
  restartPalServer,
  watchingPalServer,
};
