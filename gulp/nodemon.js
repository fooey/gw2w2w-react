'use strict';

import _ from 'lodash';
// import nodemon from 'gulp-nodemon';



function gulpTasks(gulp, server, livereload) {

    gulp.task('server', ['compile'], function() {
        return startServer(server, livereload, {
            env: {
                NODE_ENV: 'development',
            },
        });
    });

    gulp.task('server-restart', [], function() {
        return server.restart(function(error) {
            if (error) {
                console.error(error);
            }
            else {
                livereload.reload('');
            }
        });
    });


    gulp.task('server-prod', ['compile'], function() {
        return startServer(server, livereload, {
            env: {
                NODE_ENV: 'production',
                NEW_RELIC_NO_CONFIG_FILE: true,
                NEW_RELIC_LICENSE_KEY: null,
                NEW_RELIC_APP_NAME: ['gw2w2w.com'],
                NEW_RELIC_LOG: 'stdout',
                NEW_RELIC_LOG_LEVEL: 'info',
            },
        });
    });



    return gulp;
}


function startServer(server, livereload, options) {
    const config = _.merge({
        path: './server.js',
        delay : 200,
        env: {
            NODE_PATH: './',
            PORT: '3000',
        },
    }, options);

    console.log('server config');
    console.log(config);

    return server.listen(config);
}



// function startNodemon(livereload, options) {
//     let config = _.merge({
//         script: './server.js',
//         ext   : 'js jade',
//         delay : 200,
//         env: {
//             NODE_ENV: 'ERROR',
//             NODE_PATH: './',
//             PORT: '3000',
//         },
//         ignore: [
//             'public/',
//             'gulp/',
//             'gulpfile.babel.js',
//         ],
//     }, options);


//     console.log('nodemon config');
//     console.log(config);


//     return nodemon(config)
//         .on('start', function() {
//             livereload.reload('');
//         });
// }


module.exports = gulpTasks;
