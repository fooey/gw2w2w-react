'use strict';

require('babel/register');



const nodeEnv      = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const serverPort   = process.env.PORT ? process.env.PORT : 3000;



GLOBAL.timestamp   = Date.now();



if (nodeEnv !== 'development' && process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}



let express = require('express');
let app = require('./config/express')(express, nodeEnv);

require('./routes')(app, express);
// app.use(routes);




app.listen(serverPort, function() {
    console.log('');
    console.log('**************************************************');
    console.log('Express server started');
    console.log('Time: %d',     Date.now());
    console.log('Port: %d',     serverPort);
    console.log('Mode: %s',     nodeEnv);
    console.log('PID: %s',      process.pid);
    console.log('Platform: %s', process.platform);
    console.log('Arch: %s',     process.arch);
    console.log('Node: %s',     process.versions.node);
    console.log('V8: %s',       process.versions.v8);
    console.log('**************************************************');
    console.log('');
});
