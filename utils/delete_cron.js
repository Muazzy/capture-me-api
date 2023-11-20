const schedule = require('node-schedule')

module.exports = function (id) {
    return schedule.cancelJob(id)
}   