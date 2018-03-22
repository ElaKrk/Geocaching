const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {readFile} = require('./db/filedb');


const {logGetRequest, logPostRequest, logPutRequest, logDeleteRequest, logError} = require('./logging/log');
const {getGeocacheFromDbFile, addGeocacheToDbFile, changeGeocacheInDbFile, deleteGeocacheInDbFile} = require('./repository/geocaching_repository');

const app = express();

app.use(express.static(
    path.join(__dirname, '')
));

app.use(bodyParser.json());


app.get('/geocaching', async (req, res) => {
    logGetRequest(req);
    try {
        const data = await getGeocacheFromDbFile();
        res.json({data});
    } catch (error) {
        logError(error);
        res.json({result: 'error'}); 
    }
});

app.post('/geocaching', async (req, res) => {
    logPostRequest(req);
    const newGeocachingLocation = {...req.body};
    try {
        await addGeocacheToDbFile(newGeocachingLocation);
        res.json({result: 'ok'});
    } catch (error) {
        logError(error);
        res.json({result: 'error'});
    }
    
});

app.put('/geocaching/:id', async (req, res) => {
    logPutRequest(req);
    const newGeocachingLocation = {...req.body};
    try {
        await changeGeocacheInDbFile(newGeocachingLocation, req.params.id);
        res.json({result: 'ok'});
    } catch (error) {
        logError(error);
        res.json({result: 'error'});
    }
});

app.delete('/geocaching/:id', async (req, res) => {
    logDeleteRequest(req);
    try {
        await deleteGeocacheInDbFile(req.params.id);
        res.json({result: 'ok'});
    } catch (error) {
        logError(error);
        res.json({result: 'error'});
    }
});

app.listen(3000, ()=> {
    console.log('Listening on port 3000.');
})