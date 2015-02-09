var gulp = require('gulp');
var gutil = require('gulp-util');

var _ = require('lodash');
var path = require('path');

var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var watchify = require('watchify');

var notify = require('gulp-notify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var vinylBuffer = require('vinyl-buffer');
var vinylSource = require('vinyl-source-stream');


var browserify = require('browserify');
var to5ify = require('6to5ify').configure({experimental: true});
var uglify = require('gulp-uglify');


/*
*
*	paths
*
*/

var paths = {};
paths.public = './public';

paths.css = {};
paths.css.base = paths.public + '/css';
paths.css.src = paths.css.base + '/src';
paths.css.dist = paths.css.base + '/dist';

paths.js = {};
paths.js.base = paths.public + '/js';
paths.js.src = paths.js.base + '/src';
paths.js.dist = paths.js.base + '/dist';


function handleError(task) {
	return function(err) {
		gutil.log(gutil.colors.red(err));
		notify.onError(task + ' failed, check the logs..')(err);
	};
}




/*
*
*	CSS
*
*/

gulp.task('compile-css', [], function() {
	var less = require('gulp-less');
	var LessPluginCleanCSS = require("less-plugin-clean-css"),
		cleancss = new LessPluginCleanCSS({
			advanced: true,
			aggressiveMerging: true,
			keepBreaks: false,
			shorthandCompacting: true,
		});

	var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
		autoprefix = new LessPluginAutoPrefix({
			// browsers: ["last 2 versions, > 1%"] // use default
		});


	var src = paths.css.src + '/app.less';
	var dest = paths.css.dist;
	// console.log('less', src, dest);

	var stream = gulp
		.on('error', gutil.log.bind(gutil, 'Less Error'))
		.src(src)
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: [autoprefix, cleancss]
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(dest));

	return stream;
});






/*
*
*	JS
*
*/
var browserifyConfig = _.defaults(watchify.args, {
	entries: [paths.js.src + '/app.js'],
	debug: true,
	bundleExternal: true,
	ignore: ['request', 'zlib', 'assert', 'buffer', 'util', '_process'],
});

var browserifyBundler = browserify(browserifyConfig);

var watchifyBundler = watchify(browserifyBundler)
	.transform(to5ify)
	.on('error', gutil.log.bind(gutil, 'Watchify Error'))
	.on('log', function (msg) { console.log('Watchify', 'log', msg); });





var uglifier = function() {
	return uglify({
	// report: 'min',
		stripBanners: true,
		mangle: true,
		compress: true,
		output: {
			comments: false,
			beautify: false,
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

		.pipe(livereload())
};

watchifyBundler.on('update', compileJS);
gulp.task('compile-js', [], compileJS);




/*
*
*	System
*
*/

gulp.task('watch', ['compile', 'nodemon'], function(cb) {
	livereload.listen();
	gulp.watch(paths.css.src + '/**/*.less', ['compile-css']);
	// gulp.watch(paths.js.src + '/**/*.*', ['compile-js']);

	gulp.watch(paths.css.dist + '/app.min.css', livereload.changed);
	// gulp.watch(paths.js.dist + '/app.min.js', livereload.changed);
	gulp.watch('./views/**/*.jade', livereload.changed);

	cb();
});



gulp.task('nodemon', ['compile'], function(cb) {
	var called = false;
	var options = {
		script: './server.js',
		nodeArgs: ['--harmony'],
		ext: 'js,jade',
		ignore: [
			'.git/**',
			'gulpfile.js',

			'node_modules/**',
			'public/**',
		],

		delay: 200,
		env: {
			PORT: '3000',
			NODE_ENV: 'development',
		},
	};


	return nodemon(options)
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
});





/*
*
*	Tasks Wrappers
*
*/


gulp.task('compile', ['compile-js', 'compile-css'], function(cb) {
	cb();
});


gulp.task('default', ['watch'], function(cb) {

});



