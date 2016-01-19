var express = require('express');
var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');

// Új tároló (alapértelmezetten memóriában tárol)
var store = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }
    },
    serializers: [{ type: jsonapi }]
});

store.defineType('error', {
    location: {type: String},
    description: {type: String},
    date: {type: String},
    status: {type: String},
});

var server = express();

// Express middleware
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
server.use(fortune.net.http(store));

// Csak akkor fusson a szerver, ha sikerült csatlakozni a tárolóhoz
// Hasonlóan a Waterline-hoz    
var port = process.env.PORT || 8080;
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});

/*
server.get('/people', function (req, res) {
    var data = [
        {
            alma: 'piros'
        }
    ];
    res.json(data);
})
*/

