"use strict";

if (process.env.NODE_ENV !== 'development') {
	require('newrelic');
}

const express = require('express');
const app = require('./config/express')(express);
const routes = require('./routes')(express);

app.use(routes);



const server = app.listen(app.get('port'), function() {
	console.log('Listening on port %d', server.address().port);
});
