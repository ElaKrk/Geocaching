const uuidv4 = require('uuid/v4');
const {readFile, saveToFile} = require('../db/filedb');


async function addGeocacheToDbFile(newGeocachingLocation) {
    const arrayOfGeolocation = await readFile();

    const uuid = uuidv4();
    await saveToFile([{...newGeocachingLocation, uuid}, ...arrayOfGeolocation]);
}

async function changeGeocacheInDbFile(newGeocachingLocation, uuid) {
    const arrayOfGeolocation = await readFile();
    const index = arrayOfGeolocation.findIndex( el => el.uuid === uuid);
    if (index < 0) {
        throw new Error("record does not exist")
    }
    const pre = arrayOfGeolocation.slice(0, index);
    const post = arrayOfGeolocation.slice(index + 1);
    const updatedElement = {...newGeocachingLocation, uuid};
    await saveToFile([...pre, updatedElement, ...post]);
}


module.exports = {addGeocacheToDbFile, changeGeocacheInDbFile};