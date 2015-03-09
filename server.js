'use strict';
require('babel/register');

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const serverPort = process.env.PORT ? process.env.PORT : 3000;

GLOBAL.timestamp = Date.now();
GLOBAL.versionHash = "~" + require('shortid').generate() + "~";



if (process.env.NODE_ENV !== 'development') {
	require('newrelic');
}



let express = require('express');
let app = require('./config/express')(express, nodeEnv);

require('./routes')(app, express);
// app.use(routes);




app.listen(serverPort, function() {
	console.log('Listening on port %d', serverPort);
});
