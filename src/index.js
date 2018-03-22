const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {readFile} = require('../db/filedb');


const {logRequest, logError} = require('./logging/log');
const {addGeocacheToDbFile, changeGeocacheInDbFile} = require('./repository/geocaching_repository');

const app = express();

app.use(express.static(
    path.join(__dirname, '')
));

app.use(bodyParser.json());


app.get('/geocaching', async (req, res) => {
    logRequest(req);
    try {
        await readFile();
        res.json({result: 'ok'});
    } catch (error) {
        logError(error);
        res.json({result: 'error'}); 
    }
});

app.post('/geocaching', async (req, res) => {
    logRequest(req);
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
    logRequest(req);
    const newGeocachingLocation = {...req.body};
    try {
        await changeGeocacheInDbFile(newGeocachingLocation, req.params.id);
        res.json({result: 'ok'});
    } catch (error) {
        logError(error);
        res.json({result: 'error'});
    }
});

app.delete('/geocaching', async (req, res) => {
    logRequest(req);
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