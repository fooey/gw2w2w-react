
import gulp from  'gulp';

import config from './config';


var gutil        = require('gulp-util');

var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');


var less         = require('gulp-less');
var NpmImportPlugin = require('less-plugin-npm-import');
let npmImport = new NpmImportPlugin({prefix: 'npm://'});
let lessPlugins = [npmImport];

var postcss      = require('gulp-postcss');
var postcssLog   = require('postcss-reporter');

var cssAssets    = require('postcss-assets');
// var autoprefixer = require('autoprefixer-core');
var postcssFocus = require('postcss-focus');

var cssnano      = require('cssnano');
// var csswring     = require('csswring');




function gulpTasks() {

    gulp.task('build::css', ['build::css::bootstrap', 'build::css::custom'], function(cb) {
        cb();
    });



    gulp.task('build::css::custom', [], function() {
        var src  = config.paths.css.src + '/app.less';
        var dest = config.paths.css.dist;

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
            // autoprefixer({browsers: ['last 2 versions', 'ie >= 8']}),
            postcssFocus(),
            postcssLog(),
        ];


        var stream = gulp
            .on('error', gutil.log.bind(gutil, 'Less Error'))
            .src(src)
            .pipe(sourcemaps.init({debug: true}))

            .pipe(less({plugins: lessPlugins}))
            .pipe(postcss(postcssCore))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest));

        return stream;
    });



    gulp.task('css-compress', [], function() {
        var src  = config.paths.css.dist + '/app.css';
        var dest = config.paths.css.dist;

        var postcssProd = [
            cssnano({urls: false}),
            // csswring({removeAllComments: true}),
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



    gulp.task('build::css::bootstrap', [], function() {
        var src  = config.paths.css.src + '/bootstrap.less';
        var dest = config.paths.css.dist;


        var stream = gulp
            .on('error', gutil.log.bind(gutil, 'Less Error'))
            .src(src)
            .pipe(sourcemaps.init({debug: true, loadMaps: true}))
            .pipe(less({plugins: lessPlugins}))
            // .pipe(postcss([
            //     csswring({removeAllComments: true}),
            //     postcssLog(),
            // ]))
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest));

        return stream;
    });




    return gulp;
}



module.exports = gulpTasks;
