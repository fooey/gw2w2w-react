
import gulp from  'gulp';

import config from './config';




function gulpTasks(livereload) {

    gulp.task('watch', ['build'], function(cb) {


        /*
        *   Server
        */

        // gulp.watch([
        //     './server.js',
        //     './config/**',
        //     './routes/**',
        //     './views/**',
        // ], ['server-restart']);


        /*
        *   CSS Source
        */

        gulp.watch([
            config.paths.css.src + '/**/*.less',
            '!' + config.paths.css.src + '/**/bootstrap.less',
        ], ['build::css::custom']);

        gulp.watch([
            config.paths.css.src + '/bootstrap.less',
        ], ['build::css::bootstrap']);


        gulp.watch([
            config.paths.css.dist + '/app.css',
        ], ['css-compress']);



        /*
        *   CSS Production
        */

        gulp.watch([
            config.paths.css.dist + '/app.min.css',
            config.paths.css.dist + '/bootstrap.min.css',
        ], livereload.changed);



        /*
        *   Javascript
        *       JS Sources are monitored by Browserify in 'js-compile' task
        */

        gulp.watch([
            config.paths.js.dist + '/app.js',
            config.paths.js.dist + '/app.min.js',
        ], livereload.changed);



        cb();
    });



    return gulp;
}



module.exports = gulpTasks;
