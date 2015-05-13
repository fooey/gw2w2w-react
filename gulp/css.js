'use strict';

// jscs:disable esnext
// jscs:disable disallowKeywords

var gutil        = require('gulp-util');

var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');


var less         = require('gulp-less');

var postcss      = require('gulp-postcss');
var postcssLog   = require('postcss-log-warnings');

var cssAssets    = require('postcss-assets');
var autoprefixer = require('autoprefixer-core');
var postcssFocus = require('postcss-focus');

var cssnano      = require('cssnano');
var csswring     = require('csswring');




function gulpTasks(gulp, paths) {

    gulp.task('css-compile', ['css-compile-bootstrap', 'css-compile-custom'], function(cb) {
        cb();
    });



    gulp.task('css-compile-custom', [], function() {
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



    gulp.task('css-compile-bootstrap', [], function() {
        var src  = paths.css.src + '/bootstrap.less';
        var dest = paths.css.dist;


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




    return gulp;
}



module.exports = gulpTasks;
