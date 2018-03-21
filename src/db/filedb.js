const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, '../data/db.json');

async function readFile() {
    return new Promise((resolve, reject) => {
         fs.readFile(PATH, 'utf8', (err, file) => {
            if (err) {
                console.error(err);
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
                reject(err);
            }
            console.log("it\'s saved.");
            resolve();
        })
    })
}

module.exports = {readFile, saveToFile};