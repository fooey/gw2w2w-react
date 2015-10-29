'use strict';


import gulp from  'gulp';
import livereload from  'gulp-livereload';
import server from 'gulp-develop-server';





/*
*
*   Asset Paths
*
*/

let paths      = {};
paths.public   = './public';

paths.css      = {};
paths.css.base = paths.public + '/css';
paths.css.src  = paths.css.base + '/src';
paths.css.dist = paths.css.base + '/dist';

paths.js       = {};
paths.js.base  = paths.public + '/js';
paths.js.src   = paths.js.base + '/src';
paths.js.dist  = paths.js.base + '/dist';





/*
*
*   Task Modules
*
*/

require('./gulp/css')(gulp, paths);
require('./gulp/javascript')(gulp, paths);
require('./gulp/nodemon')(gulp, server, livereload);

require('./gulp/watch')(gulp, livereload, server, paths);





/*
*
*   Task Wrappers
*
*/

gulp.task('compile', ['js-compile', 'css-compile'], function(cb) {
    livereload.listen();
    cb();
});


gulp.task('default', ['watch', 'compile', 'server'], function(cb) {
    cb();
});


gulp.task('prod', ['watch', 'compile', 'nodemon-prod'], function(cb) {
    cb();
});

