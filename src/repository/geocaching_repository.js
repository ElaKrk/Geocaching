const uuidv4 = require('uuid/v4');
const {readFile, saveToFile} = require('../db/filedb');


async function addGeocacheToDbFile(newGeocachingLocation) {
    const arrayOfGeolocation = await readFile();

    const uuid = uuidv4();
    await saveToFile([{...newGeocachingLocation, uuid}, ...arrayOfGeolocation]);
}

module.exports = {addGeocacheToDbFile};