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

function findIndexOrThrow(arrayOfGeolocation, uuid) {
    const index = arrayOfGeolocation.findIndex( el => el.uuid === uuid);
    if (index < 0) {
        throw new Error("Record does not exist")
    }
    
    return index;
}

function getPreAndPost(arrayOfGeolocation, index){
    const pre = arrayOfGeolocation.slice(0, index);
    const post = arrayOfGeolocation.slice(index + 1);
    return {pre, post};
}


async function changeGeocacheInDbFile(newGeocachingLocation, uuid) {
    const arrayOfGeolocation = await readFile();
    const index = findIndexOrThrow(arrayOfGeolocation, uuid);
    const oldGeolocation = arrayOfGeolocation[index];
    
    const {pre, post} = getPreAndPost(arrayOfGeolocation, index)
    const updatedElement = {...newGeocachingLocation, uuid};
    
    await saveToFile([...pre, updatedElement, ...post]);
    logOldAndNew(oldGeolocation, updatedElement);
}

async function deleteGeocacheInDbFile(uuid) {
    const arrayOfGeolocation = await readFile();

    const index = findIndexOrThrow(arrayOfGeolocation, uuid);
    const removedGeolocation = arrayOfGeolocation[index];
    
    const {pre, post} = getPreAndPost(arrayOfGeolocation, index)
    await saveToFile([...pre, ...post]);
    logRemoved(removedGeolocation);
}

module.exports = {getGeocacheFromDbFile, addGeocacheToDbFile, changeGeocacheInDbFile, deleteGeocacheInDbFile};