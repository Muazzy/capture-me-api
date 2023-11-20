const schedule = require('node-schedule')

module.exports = function (id, cron, callback, paramsForCallBack) {
    const job = schedule.scheduleJob(id, cron, function () {
        callback(paramsForCallBack)
    })
    console.log(`job with ${id} created`)
    console.log(job)
}