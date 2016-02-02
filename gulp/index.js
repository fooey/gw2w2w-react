import path from  'path';

import gulp from  'gulp';
import livereload from  'gulp-livereload';
// import server from 'gulp-develop-server';


import config from './config';

import jsTasks from './javascript';
import cssTasks from './css';
import watchTasks from './watch';
import addServerTask from './servers';









/*
*
*   Task Modules
*
*/
jsTasks();
cssTasks();
watchTasks(livereload);




const servers = [{
    entry: 'app/server.js',
    watch: [
        'config/**',
        // 'public/**',
        'routes/**',
        'views/**',
        // '!**/dist/**',
    ],
    env: {
        PORT: 3000,
        NODE_PATH: path.resolve('./app'),
        NEW_RELIC_NO_CONFIG_FILE: true,
        NEW_RELIC_LICENSE_KEY: null,
        NEW_RELIC_APP_NAME: ['gw2w2w.com'],
        NEW_RELIC_LOG: 'stdout',
        NEW_RELIC_LOG_LEVEL: 'info',
    },
// }, {
//     entry: 'app/api/server',
//     watch: ['app/api/server/**'],
//     env: {
//         PORT: 3100,
//         NODE_PATH: './app',
//     },
}];

const serverTasks = addServerTask(servers, livereload);

gulp.task('servers', ['livereload', ...serverTasks], cb => cb());
gulp.task('livereload', [], () => livereload.listen());







/*
*
*   Task Wrappers
*
*/

gulp.task('compile', ['js-compile', 'css-compile'], cb => {
    livereload.listen();
    cb();
});


gulp.task('default', ['watch', 'compile', 'servers'], cb => {
    cb();
});


gulp.task('prod', ['watch', 'compile', 'nodemon-prod'], cb => {
    cb();
});

