'use strict';

// jscs:disable esnext
// jscs:disable disallowKeywords

var _ = require('lodash');



function gulpTasks(gulp, livereload) {

    gulp.task('nodemon', ['compile'], function() {
        return nodemon(livereload, {
            env: {
                NODE_ENV: 'development',
            },
        });
    });

    gulp.task('nodemon-prod', ['compile'], function() {
        return nodemon(livereload, {
            env: {
                NODE_ENV: 'production',
                NEW_RELIC_NO_CONFIG_FILE: true,
                NEW_RELIC_LICENSE_KEY: null,
                NEW_RELIC_APP_NAME: ['jasonrushton.com'],
                NEW_RELIC_LOG: 'stdout',
                NEW_RELIC_LOG_LEVEL: 'info',
            },
        });
    });


    return gulp;
}


function nodemon(livereload, options) {
    var config = _.merge({
        script: './server.js',
        ext   : 'js,jade',
        delay : 200,

        execMap: {
            js: 'iojs',
        },
        ignore: [
            '.git/**',
            'gulpfile.js',

            'node_modules/**',
            'public/**',
            'gulp/**',
        ],
        env: {
            PORT: '3000',
            NODE_PATH: './',
        },

    }, options);


    return require('gulp-nodemon')(config)
        .on('start', function() {
            livereload.reload('');
        });
}



module.exports = gulpTasks;
