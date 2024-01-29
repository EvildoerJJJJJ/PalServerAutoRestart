const palControl = require("./palControl");
const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();
rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const restartRule = new schedule.RecurrenceRule();
restartRule.hour = [5, 12, 18];
restartRule.minute = 0;
restartRule.second = 0;
const job = schedule.scheduleJob(rule, () => {
  palControl.watchingPalServer((val) => {
    if (val.exist) return;
    palControl
      .startPalServer()
      .then((res) => {
        console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  });
});
const restartJob = schedule.scheduleJob(restartRule, () => {
  job.cancelNext();
  palControl.watchingPalServer((val) => {
    if (val.exist) {
      palControl
        .restartPalServer()
        .then((res) => {
          console.log(res, "res");
        })
        .catch((err) => {
          console.log(err, "err");
        });
      return;
    }
    palControl
      .startPalServer()
      .then((res) => {
        console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  });
});
