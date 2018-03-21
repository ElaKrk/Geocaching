const express = require('express');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const moment = require('moment');
const {addGeocacheToDbFile} = require('./repository/geocaching_repository');

const app = express();

app.use(express.static(
    path.join(__dirname, '')
));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));


function logRequest(req) {
    const formattedTime = moment().format('lll');
    console.log(
       `${chalk.blue(formattedTime)} ${chalk.yellow(req.connection.remoteAddress)} ${chalk.green(req.method)} ${chalk.red(JSON.stringify(req.body))}`
    )
}

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