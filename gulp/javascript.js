import path from 'path';

import _ from 'lodash';

import gulp from 'gulp';
import livereload from 'gulp-livereload';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import rename from 'gulp-rename';

import browserify from 'browserify';
import uglify from 'gulp-uglify';
import watchify from 'watchify';
// import babelify from 'babelify';
// import shimify from 'browserify-shim';


const VENDOR_LIBS = [
    'async',
    'babel-polyfill',
    'classnames',
    'domready',
    'lodash',
    'moment',
    'numeral',
    'page',
    // 'process',
    'react',
    'react-dom',
    'react-redux',
    'redux',
    'superagent',
    // 'util',
];


const BROWSERIFY_DEFAULT_OPTIONS = {
    debug: true,
    cache: {},
    packageCache: {},
    plugin: [],
    transform: ['babelify'/*, 'browserify-shim'*/],
    external: VENDOR_LIBS,
    paths: ['./node_modules', './app'],
};



gulp.task('build::js::vendor', (cb) => {
    const b = browserify({require: VENDOR_LIBS});

    // _.forEach(VENDOR_LIBS, (r) => b.require(r));

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./app/build/js/'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./app/build/js/'));

    // cb();
});




export default function createJsTask(script) {
    // gutil.log('BROWSERIFY_DEFAULT_OPTIONS', BROWSERIFY_DEFAULT_OPTIONS);

    if (Array.isArray(script)) {
        return script.map(s => createJsTask(s));
    }

    const taskName = `build::js::${script.name}`;
    const pretasks = (script.pretasks) ? script.pretasks : [];
    const opts = _.defaults(script.opts, BROWSERIFY_DEFAULT_OPTIONS);

    let onUpdate = _.noop;

    if (script.watch) {
        gutil.log(taskName, 'watching enabled');
        opts.plugin.push(watchify);
        onUpdate = bundle;
    }

    // gutil.log(
    //     Date.now(),
    //     'Bundling JS',
    //     script.name,
    //     pretasks
    // );


    gulp.task(taskName, pretasks, () => {
        // gutil.log('script', script.name/*, opts*/);

        const b = browserify(opts);
        b.external(VENDOR_LIBS);

        b.on('update', () => {
            gutil.log('browserify update: ', script.name);
            onUpdate(b, script);
        });

        return bundle(b, script);
    });


    return taskName;
}








function bundle(b, script) {
    // gutil.log('bundle', script);

    return b.bundle()
        .on('error', gutil.log)

        .pipe(source(script.name))
        .pipe(buffer())
        .pipe(gulp.dest(script.dest))

        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(script.dest))

        .pipe(livereload());
}