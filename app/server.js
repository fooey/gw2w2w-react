'use strict';

require('babel-register');


// FORCE process.cwd() to this files __dirname
process.chdir(process.env.NODE_PATH);


require('./server.wrapped.js');
