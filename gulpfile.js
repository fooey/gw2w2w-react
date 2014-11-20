var gulp = require('gulp');
var _ = require('lodash');

var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var reactify = require('reactify');


var filter = require('gulp-filter');
var rename = require('gulp-rename');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');



/*
*
*	paths
*
*/

var paths = {};
paths.public = './public'

paths.css = {};
paths.css.base = paths.public + '/css'
paths.css.src = paths.css.base + '/src'
paths.css.dist = paths.css.base + '/dist'

paths.js = {};
paths.js.base = paths.public + '/js'
paths.js.src = paths.js.base + '/src'
paths.js.dist = paths.js.base + '/dist'

// paths.jsx = {};
// paths.jsx.base = paths.public + '/jsx'
// paths.jsx.src = paths.jsx.base + '/src'
// paths.jsx.dist = paths.jsx.base + '/dist'






/*
*
*	CSS
*
*/

gulp.task('clean-css', function(cb) {
	console.log('clean-css', paths.css.dist);
	
	del(paths.css.dist, cb);
});



gulp.task('less', [/*'clean-css'*/], function() {
	var less = require('gulp-less');

	var src = paths.css.src + '/app.less';
	var dest = paths.css.dist;
	console.log('less', src, dest);

	var stream = gulp
		.src(src)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(dest))

	
	stream.on('error', function (err) {
		console.log(err.toString());
		this.emit("end");
	});
	return stream;
});



gulp.task('cssmin', ['less'], function() {
	var cssmin = require('gulp-minify-css');

	var src = paths.css.dist + '/app.css';
	var dest = paths.css.dist;
	console.log('cssmin', src, dest);

	var stream = gulp
		.src(src)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(cssmin({noAdvanced: true}))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(dest))
		// .pipe(livereload.changed)

	
	stream.on('error', function (err) {
		console.log(err.toString());
		this.emit("end");
	});
	return stream;
});






/*
*
*	JS
*
*/

gulp.task('clean-js', function(cb) {
	console.log('clean-js', paths.js.dist);
	
	del(paths.js.dist, cb);
});



gulp.task('browserify', [/*'clean-js', */], function() {
	var src = paths.js.src + '/app.js';
	var dest = paths.js.dist;
	console.log('browserify', src, dest);

	var stream = browserify({
			entries: [src],
			debug: true,
			// insertGlobals: false,
			// detectGlobals: true,
			bundleExternal: true,
			ignore: ['request', 'zlib', 'assert', 'buffer', 'util', '_process'],
		})
        .transform(reactify)
		.bundle()		
		// Use vinyl-source-stream to make the
		// stream gulp compatible. Specifiy the
		// desired output filename here.
		.pipe(source('app.js'))
		// Specify the output destination
		.pipe(gulp.dest(dest));


	stream.on('error', function (err) {
		console.log(err.toString());
		this.emit("end");
	});
	
	return stream;
});



gulp.task('jsmin', ['browserify'], function() {
	var uglify = require('gulp-uglifyjs');

	var src = paths.js.dist + '/app.js';
	var dest = paths.js.dist;

	console.log('jsmin', src, dest);

	var stream = gulp
		.src(src)
		.pipe(uglify('app.min.js', {
			report: 'min',
			stripBanners: true,
			mangle: true,
			compress: true,
			output: {
				comments: false,
				beautify: false,
			},
		}))
		.pipe(gulp.dest(dest))
		// .pipe(livereload.changed)

	
	stream.on('error', function (err) {
		console.log(err.toString());
		this.emit("end");
	});
	return stream;
});




/*
*
*	System
*
*/

gulp.task('watch', ['nodemon', 'cssmin', 'jsmin'], function() {
	livereload.listen();
	gulp.watch(paths.css.src + '/**/*.less', ['cssmin']);
	gulp.watch(paths.js.src + '/**/*.*', ['jsmin']);

	gulp.watch(paths.css.dist + '/app.min.css', livereload.changed);
	gulp.watch(paths.js.dist + '/app.min.js', livereload.changed);
	gulp.watch('./views/**/*.jade', livereload.changed);
});


gulp.task('nodemon', function (cb) {
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
		.on('start', function () {
			if (!called) {
				called = true;
				cb();
			}
		})
		.on('restart', function () {
			console.log('restarted!');
			livereload();
		});
});





/*
*
*	Tasks Wrappers
*
*/


gulp.task('default', ['watch'], function(cb) {

});



