'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    webpack = require('webpack-stream'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css');

// require('es6-promise').polyfill();

var path = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: { 
        html: 'src/pages/*.html',
        js: 'src/js/main.js',
        style: 'src/scss/main.scss',
        img: 'src/img/**/*.*',
        fonts: ['src/fonts/**/*.*', 'node_modules/material-design-icons-iconfont/dist/fonts/MaterialIcons-Regular.*']
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/**/*.js',
        style: 'src/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['./node_modules/', './src/', './vendor/']
        }))
        .pipe(prefixer())
        .pipe(sourcemaps.write())
       // .pipe(cleanCSS())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(webpack({
            output: {
                publicPath: "../js/",
                filename: "main.js",
                library: "app"
            },
            resolve: {
                modulesDirectories: ['node_modules', 'src/components', 'vendor']
            },
            node: {
              fs: "empty"
            },
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: "babel",
                    exclude:  /(node_modules|dist)/,
                    query: {
                        presets: ['es2015']
                    }
                }]
            }
        }))
        .pipe(sourcemaps.write())
       // .pipe(uglify({minimize: true}))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('default', ['build', 'watch']);