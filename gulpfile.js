'use strict';

// jscs:disable esnext
// jscs:disable disallowKeywords

var gulp        = require('gulp');
var gutil       = require('gulp-util');

var _           = require('lodash');
// var path     = require('path');

var livereload  = require('gulp-livereload');
var watchify    = require('watchify');

// var notify   = require('gulp-notify');
var rename      = require('gulp-rename');
// var replace     = require('gulp-replace');
var sourcemaps  = require('gulp-sourcemaps');

var vinylBuffer = require('vinyl-buffer');
// var vinylMap    = require('vinyl-map');
var vinylSource = require('vinyl-source-stream');


var browserify  = require('browserify');
var babelify    = require('babelify'); // .configure({experimental: true});
var uglify      = require('gulp-uglify');


/*
*
* paths
*
*/

var paths = {};
paths.public = './public';

paths.css = {};
paths.css.base = paths.public + '/css';
paths.css.src  = paths.css.base + '/src';
paths.css.dist = paths.css.base + '/dist';

paths.js = {};
paths.js.base = paths.public + '/js';
paths.js.src  = paths.js.base + '/src';
paths.js.dist = paths.js.base + '/dist';


// function handleError(task) {
//  return function(err) {
//    gutil.log(gutil.colors.red(err));
//    notify.onError(task + ' failed, check the logs..')(err);
//  };
// }




/*
*
* CSS
*
*/

var less         = require('gulp-less');

var postcss      = require('gulp-postcss');
var postcssLog   = require('postcss-log-warnings');

var cssAssets    = require('postcss-assets');
var autoprefixer = require('autoprefixer-core');
var postcssFocus = require('postcss-focus');

var cssnano      = require('cssnano');
var csswring     = require('csswring');

gulp.task('compile-css', [], function() {
    var src  = paths.css.src + '/app.less';
    var dest = paths.css.dist;

    var postcssCore = [
        cssAssets({
            basePath: './public/',
            cachebuster: function(filePath, urlPathname) {
                var fs = require('fs');
                var path = require('path');
                var hash = fs.statSync(filePath).mtime.getTime().toString(16);
                var pathname = path.dirname(urlPathname)
                        + '/' + path.basename(urlPathname, path.extname(urlPathname))
                        + '.~' + hash + '~' + path.extname(urlPathname);

                // console.log(hash, filePath, pathname);
                return {
                    pathname: pathname,
                };
            },
        }),
        autoprefixer({browsers: ['last 2 versions', 'ie >= 8']}),
        postcssFocus(),
        postcssLog(),
    ];

    // var versionHash = "~" + require('shortid').generate() + "~";

    var stream = gulp
        .on('error', gutil.log.bind(gutil, 'Less Error'))
        .src(src)
        .pipe(sourcemaps.init({debug: true}))

        .pipe(less())
        .pipe(postcss(postcssCore))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));

    return stream;
});



gulp.task('css-compress', [], function() {
    var src  = paths.css.dist + '/app.css';
    var dest = paths.css.dist;

    var postcssProd = [
        cssnano({urls: false}),
        csswring({removeAllComments: true}),
        postcssLog(),
    ];

    var stream = gulp
        .on('error', gutil.log.bind(gutil, 'Less Error'))
        .src(src)
        .pipe(sourcemaps.init({debug: true, loadMaps: true}))
        .pipe(postcss(postcssProd))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));

    return stream;
});



gulp.task('compile-bootstrap', [], function() {
    var src  = paths.css.src + '/bootstrap.less';
    var dest = paths.css.dist;

    // var versionHash = "~" + require('shortid').generate() + "~";

    var stream = gulp
        .on('error', gutil.log.bind(gutil, 'Less Error'))
        .src(src)
        .pipe(sourcemaps.init({debug: true, loadMaps: true}))
        .pipe(less())
        .pipe(postcss([
            csswring({removeAllComments: true}),
            postcssLog(),
        ]))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));

    return stream;
});






/*
*
* JS
*
*/
var browserifyConfig = _.defaults(watchify.args, {
    entries       : [paths.js.src + '/app.js'],
    debug         : true,
    bundleExternal: true,
    verbose       : true,
    ignore        : ['request', 'zlib', 'assert', 'buffer', 'util', '_process'],
});

var browserifyBundler = browserify(browserifyConfig)
    // .on('bundle', logEvent.bind(null, 'bundle'))
    // .on('reset',  logEvent.bind(null, 'reset '))
    .on('error', gutil.log.bind(gutil, 'Browserify Error'));

var watchifyBundler = watchify(browserifyBundler)
    .transform(babelify)
    .on('update', logEvent.bind(null, 'update'))
    // .on('bytes',  logEvent.bind(null, 'bytes '))
    // .on('time',   logEvent.bind(null, 'time  '))
    .on('log',    logEvent.bind(null, 'log   '))
    .on('error', gutil.log.bind(gutil, 'Watchify Error'));


function logEvent(event, data) {
    console.log('%d Watchify Event :: %s :: %s', Date.now(), event, JSON.stringify(data));
}





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

        .pipe(gulp.dest(paths.js.dist)) // minified app.min.js

        .pipe(livereload());
};

watchifyBundler.on('update', compileJS);
gulp.task('compile-js', [], compileJS);




/*
*
* System
*
*/

gulp.task('watch', [], function(cb) {
    livereload.listen();

    gulp.watch([
        paths.css.src + '/**/*.less',
        '!' + paths.css.src + '/**/bootstrap.less',
    ], ['compile-css']);
    gulp.watch([
        paths.css.src + '//bootstrap.less',
    ], ['compile-bootstrap']);

    gulp.watch([
        paths.css.dist + '/app.css',
    ], ['css-compress']);

    gulp.watch([
        paths.css.dist + '/app.min.css',
        paths.css.dist + '/bootstrap.min.css',
    ], livereload.changed);

    gulp.watch('./views/**/*.jade', livereload.changed);

    cb();
});




function nodemon(cb, options) {
    var config = _.merge({
        execMap: {
            js: 'iojs',
        },
        script: './server.js',
        ext: 'js,jade',
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

        delay: 200,
    }, options);

    var called = false;


    return require('gulp-nodemon')(config)
        .on('start', function() {
            if (!called) {
                called = true;
                cb();
            }
        })
        .on('restart', function() {
            console.log('restarted!');
            livereload();
        });
}

gulp.task('nodemon', ['compile'], function(cb) {
    return nodemon(cb, {
        env: {
            NODE_ENV: 'development',
        },
    });
});

gulp.task('nodemon-prod', ['compile'], function(cb) {
    return nodemon(cb, {
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







/*
*
* Tasks Wrappers
*
*/


gulp.task('compile', ['compile-js', 'compile-css', 'compile-bootstrap'], function(cb) {
    cb();
});


gulp.task('default', ['watch', 'compile', 'nodemon'], function(cb) {
    cb();
});


gulp.task('prod', ['watch', 'compile', 'nodemon-prod'], function(cb) {
    cb();
});

