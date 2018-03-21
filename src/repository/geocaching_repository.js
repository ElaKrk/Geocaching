const uuidv4 = require('uuid/v4');
const fs = require('fs');
const PATH = './db/db.json';

async function readFile() {
    return new Promise((resolve, reject) => {
         fs.readFile(PATH, 'utf8', (err, file) => {
            if (err) {
                reject(err)
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
    console.log(`arrayOfGeolocation: ${arrayOfGeolocation}`);
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

async function addGeocacheToDbFile(newGeocachingLocation) {
    const arrayOfGeolocation = await readFile();

    const uuid = uuidv4();
    await saveToFile([{...newGeocachingLocation, uuid}, ...arrayOfGeolocation]);
}

module.exports = {addGeocacheToDbFile};

// addGeocacheToDbFile(newGeocachingLocation)
//     .catch(err => console.log(err));