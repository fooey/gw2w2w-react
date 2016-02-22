import express from 'express';

import { createExpressApp } from 'config/express';
import { initRoutes } from 'routes/server';


GLOBAL.timestamp   = Date.now();


const nodeEnv      = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const serverPort   = process.env.PORT ? process.env.PORT : 3000;


if (nodeEnv !== 'development' && process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}


const app = createExpressApp(express, nodeEnv);

initRoutes(app, express);

// app.use('*', (req, res) => {
//     console.log(req.ip); res.status(403).send('buzz off');
// });



app.listen(serverPort, () => {
    console.log('');
    console.log('**************************************************');
    console.log('Express server started');
    console.log('Time:     %d', Date.now());
    console.log('Port:     %d', serverPort);
    console.log('Mode:     %s', nodeEnv);
    console.log('cwd:      %s', process.cwd());
    console.log('');
    console.log('PID:      %s', process.pid);
    console.log('Platform: %s', process.platform);
    console.log('Arch:     %s', process.arch);
    console.log('Node:     %s', process.versions.node);
    console.log('V8:       %s', process.versions.v8);
    console.log('**************************************************');
    console.log('');
});