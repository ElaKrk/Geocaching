const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const {logRequest, logError} = require('./logging/log');
const {addGeocacheToDbFile, changeGeocacheInDbFile} = require('./repository/geocaching_repository');

const app = express();

app.use(express.static(
    path.join(__dirname, '')
));

app.use(bodyParser.json());


app.get('/geocaching', (req, res) => {
    logRequest(req);
    res.json(`Get message`);
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
    logRequest(req)
    const newGeocachingLocation = {...req.body};
    try {
        await changeGeocacheInDbFile(newGeocachingLocation, req.params.id);
        res.json({result: 'ok'});
    } catch (error) {
        logError(error);
        res.json({result: 'error'});
    }
});

app.delete('/geocaching', (req, res) => {
    logRequest(req)
    res.json(`Deleted`);
});

app.listen(3000, ()=> {
    console.log('Listening on port 3000.');
})