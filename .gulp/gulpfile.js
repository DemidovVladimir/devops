var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    stylish = require('gulp-jscs-stylish'),
    csslint = require('gulp-csslint'),
    guppy = require('git-guppy')(gulp),
    gulpFilter = require('gulp-filter'),
    gutil = require('gulp-util'),
    es = require('event-stream'),
    inspect = require('util').inspect,
    _ = require('lodash');


var srcs = {
    jslint: [
        '!./../.meteor/**/*.js',
        '!./../packages/**/*.js',
        '!./../**/node_modules',
        '!./../public/*.js',
        '!./../public/**/*.js',
        './../*.js',
        './../**/*.js'
    ],
    csslint: [
        '!./../.meteor/**/*.css',
        '!./../packages/**/*.css',
        '!./../**/node_modules',
        '!./../public/*.css',
        '!./../public/**/*.css',
        './../*.css',
        './../**/*.css'
    ]
};

gulp.task('jslint', function () {
    return watch(srcs.jslint, function () {
        gulp.src(srcs.jslint)
            .pipe(plumber())
            .pipe(jshint('.jshintrc'))
            .pipe(jscs('.jscsrc'))
            .pipe(stylish.combineWithHintResults())
            .pipe(jshint.reporter('jshint-stylish'));
    });
});

gulp.task('csslint', function () {
    return watch(srcs.csslint, function () {
        gulp.src(srcs.csslint)
            .pipe(csslint('.csslintrc'))
            .pipe(csslint.reporter('jshint-stylish'));
    });
});

gulp.task('default', ['jslint', 'csslint']);

var errorReporter = function errorReporter (data) {
    //process.on('uncaughtException', function(err) {
    //    console.log('Caught exception: ' + err);
    console.log(data);
    process.exit(1);
    //});


    //return map(function (file, cb) {
    //    console.log('some happs');
    //    console.log(file);
    //});
};

//gulp.task('pre-commit', function () {
//    return guppy.stream('pre-commit')
//        .pipe(gulpFilter(['*.js']))
//        .pipe(jshint('.jshintrc'))
//        .pipe(errorReporter())
//        .pipe(jshint.reporter('jshint-stylish'))
//        .pipe(jshint.reporter('fail'));
//});
//
//gulp.task('prepare-commit-msg', function () {
//    return guppy.stream('pre-commit')
//        .pipe(gulpFilter(['*.js']))
//        .pipe(jshint('.jshintrc'))
//        .pipe(errorReporter())
//        .pipe(jshint.reporter('jshint-stylish'))
//        .pipe(jshint.reporter('fail'));
//});

//gulp.task('pre-commit', guppy.src('pre-commit', function (filesBeingCommitted) {
//    console.log(filesBeingCommitted);
//    var newFiles = _.map(filesBeingCommitted, function(n) {
//        return '../' + n;
//    });
//    return gulp.src(newFiles)
//        .pipe(gulpFilter(['*.js']))
//        .pipe(jshint('.jshintrc'))
//        .pipe(es.map(function (data, cb) { //turn this async function into a stream
//            errorReporter(data);
//        }))
//        //.pipe(errorReporter(data))
//        .pipe(jshint.reporter('jshint-stylish'))
//        .pipe(jshint.reporter('fail'));
//}));

gulp.task('pre-commit', function () {
    return gulp.src([ '../client/**/*', '../server/**/*', '../*', '*' ])
        .pipe(gulpFilter(['*.js']))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(es.map(function (data, cb) { //turn this async function into a stream
            errorReporter(data);
        }));
});

gulp.task('prepare-commit-msg', guppy.src('prepare-commit-msg', function (filesBeingCommitted) {
    return gulp.src('../' + filesBeingCommitted)
        .pipe(gulpFilter(['*.js']))
        .pipe(jshint('.jshintrc'))
        .pipe(es.map(function (data, cb) { //turn this async function into a stream
            if (!data.jshint.success) {
                process.exit(1);
            }
        }))
        .pipe(jshint.reporter('jshint-stylish'));
}));

//gulp.task('prepare-commit-msg', function () {
//    return gulp.src(guppy.src('prepare-commit-msg'))
//        .pipe(gulpFilter(['*.js']))
//        .pipe(jshint('.jshintrc'))
//        .pipe(errorReporter())
//        .pipe(jshint.reporter('jshint-stylish'))
//        .pipe(jshint.reporter('fail'));
//});

//gulp.task('pre-push', guppy.src('pre-push', function (files, extra, cb) {
//    return gulp.src('../'+filesBeingCommitted)
//        .pipe(gulpFilter(['*.js']))
//        .pipe(jshint('.jshintrc'))
//        .pipe(jscs('.jscsrc'))
//        .pipe(csslint('.csslintrc'))
//        .pipe(stylish.combineWithHintResults())
//        .pipe(jshint.reporter('jshint-stylish'))
//        .pipe(jshint.reporter('fail'));
//    console.log(files);
//    if (branch === 'master') {
//        cb('Don\'t push master!')
//    } else {
//        cb();
//    }
//}));