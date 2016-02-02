'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';

import _ from 'lodash';

import browserify from 'browserify';
import watchify from 'watchify';
import uglify from 'gulp-uglify';

import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';

import vinylBuffer from 'vinyl-buffer';
import vinylSource from 'vinyl-source-stream';


import aliasify from 'aliasify';
import shimify from 'browserify-shim';
import babelify from 'babelify';


import config from './config';




function logEvent(event, data) {
    console.log('%d Watchify Event :: %s :: %s', Date.now(), event, JSON.stringify(data));
}



export default function gulpTasks() {

    var browserifyConfig = _.defaults(watchify.args, {
        entries       : [config.paths.js.src + '/app.js'],
        debug         : true,
        bundleExternal: true,
        verbose       : true,
        ignore        : ['request', 'zlib', 'assert', 'buffer', 'util', '_process'],
        transform     : [babelify, aliasify, shimify],
    });

    var browserifyBundler = browserify(browserifyConfig)
        // .on('bundle', logEvent.bind(null, 'bundle'))
        // .on('reset',  logEvent.bind(null, 'reset '))
        // .transform('babelify')
        // .transform('aliasify')
        // .transform('browserify-shim')
        .on('error', gutil.log.bind(gutil, 'Browserify Error'));

    var watchifyBundler = watchify(browserifyBundler)
        .on('update', logEvent.bind(null, 'update'))
        // .on('bytes', logEvent.bind(null, 'bytes '))
        // .on('time', logEvent.bind(null, 'time  '))
        .on('log', logEvent.bind(null, 'log   '))
        .on('error', gutil.log.bind(gutil, 'Watchify Error'));


    var uglifier = () => {
        return uglify({
            // report: 'min',
            stripBanners: true,
            mangle: true,
            compress: {
                unsafe: true,
                drop_console: true,
            },
        }).on('error', gutil.log.bind(gutil, 'Uglify Error'));
    };




    var compileJS = () => {
        return watchifyBundler
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))

            .pipe(vinylSource('app.js'))
            .pipe(vinylBuffer())

            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.paths.js.dist)) // non-minified app.js

            .pipe(sourcemaps.init({loadMaps: true}))

            .pipe(uglifier())

            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('./'))

            .pipe(gulp.dest(config.paths.js.dist)); // minified app.min.js

        // .pipe(livereload());
    };


    watchifyBundler.on('update', compileJS);
    gulp.task('js-compile', [], compileJS);



    return gulp;
}
