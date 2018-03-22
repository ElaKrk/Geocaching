const uuidv4 = require('uuid/v4');
const {readFile, saveToFile} = require('../db/filedb');
const {logOldAndNew, logRemoved} = require('../logging/log');


async function getGeocacheFromDbFile() {
    return await readFile();
}

async function addGeocacheToDbFile(newGeocachingLocation) {
    const arrayOfGeolocation = await readFile();

    const uuid = uuidv4();
    await saveToFile([{...newGeocachingLocation, uuid}, ...arrayOfGeolocation]);
}

async function changeGeocacheInDbFile(newGeocachingLocation, uuid) {
    const arrayOfGeolocation = await readFile();
    const index = arrayOfGeolocation.findIndex( el => el.uuid === uuid);
    const oldGeolocation = arrayOfGeolocation[index];
    if (index < 0) {
        throw new Error("Cannot change the geolocation - record does not exist")
    }
    const pre = arrayOfGeolocation.slice(0, index);
    const post = arrayOfGeolocation.slice(index + 1);
    const updatedElement = {...newGeocachingLocation, uuid};
    await saveToFile([...pre, updatedElement, ...post]);
    const newGeolocation = arrayOfGeolocation[index];
    logOldAndNew(oldGeolocation, newGeolocation);
}

async function deleteGeocacheInDbFile(uuid) {
    const arrayOfGeolocation = await readFile();
    const index = arrayOfGeolocation.findIndex( el => el.uuid === uuid);
    const removedGeolocation = arrayOfGeolocation[index];
    if (index < 0) {
        throw new Error("Cannot delete the geolocation - record does not exist")
    }
    const pre = arrayOfGeolocation.slice(0, index);
    const post = arrayOfGeolocation.slice(index + 1);
    await saveToFile([...pre, ...post]);
    logRemoved(removedGeolocation);
}

module.exports = {getGeocacheFromDbFile, addGeocacheToDbFile, changeGeocacheInDbFile, deleteGeocacheInDbFile};