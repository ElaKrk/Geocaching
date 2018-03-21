const chalk = require('chalk');
const log = console.log;
const moment = require('moment');

function logRequest(req) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} ${chalk.yellow(req.connection.remoteAddress)} ${chalk.green(req.method)} ${chalk.red(JSON.stringify(req.body))}`);
}

function logError(err) {
    log(`${chalk.bold.red(err)}`)
}

module.exports = {logRequest, logError};