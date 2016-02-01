'use strict';

require('babel-register');


// FORCE process.cwd() to this files __dirname
process.chdir(__dirname);


require('./server.wrapped.js');
