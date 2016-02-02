import gulp from  'gulp';
import livereload from  'gulp-livereload';
import server from 'gulp-develop-server';


import config from './config';

import jsTasks from './javascript';









/*
*
*   Task Modules
*
*/

require('./css')(gulp, config.paths);
jsTasks(gulp);
require('./nodemon')(gulp, server, livereload);

require('./watch')(gulp, livereload, server, config.paths);





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

