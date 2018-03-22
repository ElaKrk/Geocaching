const chalk = require('chalk');
const log = console.log;
const moment = require('moment');

function logError(err) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} ${chalk.bold.red(err)}`)
}

function logGetRequest(req) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} ${chalk.yellow(req.connection.remoteAddress)} ${chalk.green(req.method)}`);
}

function logPostRequest(req) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} ${chalk.yellow(req.connection.remoteAddress)} ${chalk.green(req.method)} ${chalk.magenta(JSON.stringify(req.body))}`);
}

function logPutRequest(req) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} ${chalk.yellow(req.connection.remoteAddress)} ${chalk.green(req.method)} ${chalk.magenta(JSON.stringify(req.body))} ${chalk.cyan(JSON.stringify(req.params.id))}`);
}

function logDeleteRequest(req) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} ${chalk.yellow(req.connection.remoteAddress)} ${chalk.green(req.method)} ${chalk.cyan(JSON.stringify(req.params.id))}`);
}

function logOldAndNew(oldGeolocation, newGeocachingLocation) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} old geolocation: ${chalk.red(JSON.stringify(oldGeolocation))} new geolocation: ${chalk.green(JSON.stringify(newGeocachingLocation))} `)
}

function logRemoved(oldGeolocation) {
    const formattedTime = moment().format('lll');
    log(`${chalk.blue(formattedTime)} removed geolocation: ${chalk.red(JSON.stringify(oldGeolocation))}`)
}

module.exports = {logGetRequest, logPostRequest, logPutRequest, logDeleteRequest, logError, logOldAndNew, logRemoved};