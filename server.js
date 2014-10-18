'use strict';

const express = require('express');
const app = require('./config/express')(express);
const routes = require('./routes')(express);

app.use(routes)



const server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});