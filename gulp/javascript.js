'use strict';

// jscs:disable esnext
// jscs:disable disallowKeywords

var gutil       = require('gulp-util');

var _           = require('lodash');

var browserify  = require('browserify');
var watchify    = require('watchify');
var uglify      = require('gulp-uglify');

var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');

var vinylBuffer = require('vinyl-buffer');
var vinylSource = require('vinyl-source-stream');


var aliasify    = require('aliasify');
var shimify     = require('browserify-shim');
var babelify    = require('babelify').configure({
    optional: [
        'optimisation.react.constantElements',
        'minification.inlineExpressions',
    ],
});




function logEvent(event, data) {
    console.log('%d Watchify Event :: %s :: %s', Date.now(), event, JSON.stringify(data));
}



function gulpTasks(gulp, paths) {

    var browserifyConfig = _.defaults(watchify.args, {
        entries       : [paths.js.src + '/app.js'],
        debug         : true,
        bundleExternal: true,
        verbose       : true,
        ignore        : ['request', 'zlib', 'assert', 'buffer', 'util', '_process'],
        transform     : [babelify, aliasify, shimify],
    });

    var browserifyBundler = browserify(browserifyConfig)
        // .on('bundle', logEvent.bind(null, 'bundle'))
        // .on('reset',  logEvent.bind(null, 'reset '))
        .on('error', gutil.log.bind(gutil, 'Browserify Error'));

    var watchifyBundler = watchify(browserifyBundler)
        .on('update', logEvent.bind(null, 'update'))
        // .on('bytes', logEvent.bind(null, 'bytes '))
        // .on('time', logEvent.bind(null, 'time  '))
        .on('log', logEvent.bind(null, 'log   '))
        .on('error', gutil.log.bind(gutil, 'Watchify Error'));


    var uglifier = function() {
        return uglify({
            // report: 'min',
            stripBanners: true,
            mangle      : true,
            compress: {
                unsafe      : true,
                drop_console: true,
            },
        }).on('error', gutil.log.bind(gutil, 'Uglify Error'));
    };




    var compileJS = function() {
        return watchifyBundler
            .bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))

            .pipe(vinylSource('app.js'))
            .pipe(vinylBuffer())

            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.js.dist)) // non-minified app.js

            .pipe(sourcemaps.init({loadMaps: true}))

            .pipe(uglifier())

            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('./'))

            .pipe(gulp.dest(paths.js.dist)); // minified app.min.js

        // .pipe(livereload());
    };


    watchifyBundler.on('update', compileJS);
    gulp.task('js-compile', [], compileJS);



    return gulp;
}



module.exports = gulpTasks;
