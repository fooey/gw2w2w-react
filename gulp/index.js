import path from  'path';

import gulp from  'gulp';
import livereload from  'gulp-livereload';


// import config from './config';

// import jsTasks from './javascript';
import createJsTask from './javascript';
import cssTasks from './css';
import watchTasks from './watch';
import createServerTask from './servers';









/*
*
*   Task Modules
*
*/
// jsTasks();
cssTasks();
watchTasks(livereload);


const scripts = [{
    opts: {
        entries: 'app/app.js',
    },
    name: 'app.js',
    dest: 'app/build/js/',
    watch: true,
    pretasks: ['build::js::vendor'],
// }, {
//     name: 'vendor.js',
//     require: ['react', 'react-dom', 'async', 'lodash', 'domready', 'page'],
//     dest: 'app/www/static/js/',
//     watch: false,
// }, {
//     name: 'entry3.js',
//     entries: 'app/www/client/entry3.js',
//     dest: 'app/www/static/js/',
//     watch: true,
}];

const jsTasks = createJsTask(scripts);

console.log('jsTasks', jsTasks);

gulp.task('build::js', [...jsTasks], cb => cb());




const devServers = [{
    entry: 'app/server.js',
    watch: [
        'package.json',
        'app/server.js',
        'app/components/layout/root.js',
        'app/server.wrapped.js',
        'app/config/**',
        'app/routes/server/**',
    ],
    dependencies: ['build', 'livereload'],
    env: {
        PORT: 3000,
        NODE_ENV: 'development',
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

const devServerTasks = createServerTask(devServers, livereload);








/*
*
*   Task Wrappers
*
*/

gulp.task('default', ['watch', 'build', 'dev-servers'], cb => {
    cb();
});


// gulp.task('prod', ['watch', 'build', 'nodemon-prod'], cb => {
//     cb();
// });


gulp.task('build', ['build::js', 'build::css'], cb => {
    livereload.listen();
    cb();
});

gulp.task('livereload', [], () => livereload.listen());

gulp.task('dev-servers', [...devServerTasks], cb => cb());

