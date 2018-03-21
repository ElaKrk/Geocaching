const fs = require('fs');
const path = require('path');
const {logError} = require('../logging/log');

const PATH = path.join(__dirname, '../data/db.json');

async function readFile() {
    return new Promise((resolve, reject) => {
         fs.readFile(PATH, 'utf8', (err, file) => {
            if (err) {
                logError(err);
                return reject(err)
            };
            if (file.length !== 0) {
                const arrayOfGeolocation = JSON.parse(file)
                resolve(arrayOfGeolocation);
            } else {
                resolve([]);
            }
        })
    })
}


async function saveToFile(arrayOfGeolocation) {
    return new Promise((resolve, reject) => {
         fs.writeFile(PATH, JSON.stringify(arrayOfGeolocation), (err) => {
            if (err) {
                logError(err);
                return reject(err);
            }
            resolve();
        })
    })
}

module.exports = {readFile, saveToFile};