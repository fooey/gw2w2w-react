'use strict';

// jscs:disable esnext
// jscs:disable disallowKeywords

var gulp       = require('gulp');
var livereload = require('gulp-livereload');





/*
*
*   Asset Paths
*
*/

var paths      = {};
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

gulp = require('./gulp/css')(gulp, paths);
gulp = require('./gulp/javascript')(gulp, paths);
gulp = require('./gulp/watch')(gulp, livereload, paths);
gulp = require('./gulp/nodemon')(gulp, livereload);





/*
*
*   Task Wrappers
*
*/

gulp.task('compile', ['js-compile', 'css-compile'], function(cb) {
    livereload.listen();
    cb();
});


gulp.task('default', ['watch', 'compile', 'nodemon'], function(cb) {
    cb();
});


gulp.task('prod', ['watch', 'compile', 'nodemon-prod'], function(cb) {
    cb();
});

