'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');

var config = {
    js: {
        src: './assets/js/app.js',
        outputDir: './public/js/',
        mapDir: './maps/',
        outputFile: 'app.min.js',
        jsDir: './assets/js/**/*.js'
    },
};

// task
gulp.task('compile-js', function () {
    var bundledStream = through();

  bundledStream
    .pipe(source(config.js.src))
    .pipe(buffer())
    .pipe(rename(config.js.outputFile))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write(config.js.mapDir))
    .pipe(gulp.dest(config.js.outputDir));

    globby([config.js.jsDir]).then(function(entries) {
        var b = browserify({
          entries: entries,
          debug: true,
          transform: [reactify]
        });

        b.bundle().pipe(bundledStream);
    }).catch(function(err) {
        // ensure any errors from globby are handled
        bundledStream.emit('error', err);
    });

  return bundledStream;
});

// task
gulp.task('jshint', function() {
  return gulp.src(config.js.jsDir)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// task
gulp.task('watch', function () {
    gulp.watch([config.js.jsDir], ['jshint','compile-js']);
});

// runner
gulp.task('default', ['watch']);