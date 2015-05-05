'use strict';

// jscs:disable esnext
// jscs:disable disallowKeywords




function gulpTasks(gulp, livereload, paths) {

    gulp.task('watch', ['compile'], function(cb) {

        /*
        *   CSS Source
        */

        gulp.watch([
            paths.css.src + '/**/*.less',
            '!' + paths.css.src + '/**/bootstrap.less',
        ], ['css-compile-custom']);

        gulp.watch([
            paths.css.src + '//bootstrap.less',
        ], ['css-compile-bootstrap']);


        gulp.watch([
            paths.css.dist + '/app.css',
        ], ['css-compress']);



        /*
        *   CSS Production
        */

        gulp.watch([
            paths.css.dist + '/app.min.css',
            paths.css.dist + '/bootstrap.min.css',
        ], livereload.changed);



        /*
        *   Javascript
        *       JS Sources are monitored by Browserify in 'js-compile' task
        */

        gulp.watch([
            paths.js.dist + '/app.js',
            paths.js.dist + '/app.min.js',
        ], livereload.changed);



        /*
        *   Serverside Templates
        */

        gulp.watch([
            './views/**/*.jade',
        ], livereload.changed);



        cb();
    });



    return gulp;
}



module.exports = gulpTasks;
