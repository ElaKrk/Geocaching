const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const {logRequest, logError} = require('./logging/log');
const {addGeocacheToDbFile} = require('./repository/geocaching_repository');

const app = express();

app.use(express.static(
    path.join(__dirname, '')
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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

app.put('/geocaching', (req, res) => {
    logRequest(req)
    res.json(`Put`);
});

app.delete('/geocaching', (req, res) => {
    logRequest(req)
    res.json(`Deleted`);
});

app.listen(3000, ()=> {
    console.log('Listening on port 3000.');
})