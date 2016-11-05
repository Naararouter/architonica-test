//Подключаем необходимые модули
const gulp = require('gulp');

const sass = require('gulp-sass');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');

const gutil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const stripDebug = require('gulp-strip-debug');
const imagemin = require('gulp-imagemin');
const cssmin = require('gulp-cssmin');

const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');

const path = require('path');
const fs = require("fs");
const url = require("url");
const browserSync = require('browser-sync').create();

//Update 25.08.16
const args = require('yargs').argv;
const flatten = require('gulp-flatten');

//Переменная для заказчика
const isDevelopment = true;

const build = isDevelopment ? "build" : "dist";
//----
var bCount = true;
var b;
function bundle(callback) {
    return b
    .bundle()
    .on('error', err => {
        gutil.log("Browserify Error", gutil.colors.red(err.message))
    })
    .pipe(source('app.js'))

    .pipe(gulpIf(!isDevelopment,buffer()))
    .pipe(gulpIf(!isDevelopment,stripDebug()))
    .pipe(gulpIf(!isDevelopment,uglify()))

    .pipe(gulp.dest(build)).on('end',()=>{
            browserSync.reload();
            callback();
        });
}
gulp.task('build_scss',function () {
    var dirInput = args.dirIn || '/';
    var ditOutput = args.dirOut || dirInput + '/output';
    return gulp.src(dirInput+'**/*.scss')
        .pipe(sass())
        .pipe(flatten())
        .pipe(gulp.dest(ditOutput))
});
//Копируем папку www
gulp.task('www',function () {
    return gulp.src('src/www/**/*.*',{since: gulp.lastRun('www')})
        .pipe(newer(build))
    //Если файл имеет расширение *.scss, то компилируем его в *.css
        .pipe(gulpIf(function (file) {
            return file.extname == '.scss'
        },sass()))
        .pipe(gulpIf(function (file) {
            return ((!isDevelopment)&&(file.extname == '.css'));
        },cssmin()))
        .pipe(gulpIf(function (file) {
            return file.extname == '.css';
        },autoprefixer({browsers:['Chrome > 20', 'IE >= 9']})))
        .pipe(gulpIf(function (file) {
            var ext = file.extname;
            return ((!isDevelopment)&&((ext== '.jpg')||(ext== '.png')));
        },imagemin()))
        .pipe(gulpIf(function (file) {
            return ((!isDevelopment)&&(file.extname == '.js'))
        },uglify()))
        .pipe(gulp.dest(build))
});
//Компилируем JS в монолитный файл
gulp.task('bindBrowserify',function (callback) {
    b = browserify({
        entries: 'src/app/app.js',
        extensions: ['.js'],
        cache: {},
        packageCache: {},
        //debug: true,
        plugin: [watchify]
    }).transform(babelify.configure({
        presets: ["es2015","react","stage-1"]
    })).on('update', function () {
        console.log('App\'s JS chandeg!');
        bundle(callback);
    }).on('bundle', function () {
        if(bCount) {
            console.log('Watchify src/app start...');
            bCount = false;
        }
    }).on('log', gutil.log);
    return new Promise((res)=>{res()});
});
gulp.task('app',function (callback) {
   return bundle(callback);
});
gulp.task('build_app',gulp.series('bindBrowserify','app'));
//Очищаем директорию
gulp.task('clean',function () {
    return del(build);
});
function gulpWatch(directory) {
    gulp.watch('src/'+directory+'/**/*.*', gulp.series(directory)).on('unlink',function (filepath) {
        var filePathFromSrc = path.relative(path.resolve('src/'+directory), filepath);
        var destFilePath = path.resolve(build, filePathFromSrc);
        del.sync(destFilePath);
    })
}
//BrowserSync
gulp.task('server',function () {
    if(isDevelopment){
        browserSync.init({
            proxy: "localhost:3000"
        });
    }
    return new Promise((res)=>{res()});
});
gulp.task('watch_www',function () {
    if(isDevelopment){
        gulpWatch("www")
    } else {
        console.log('Production building done!');
        return new Promise((res)=>{res()});
    }
});

gulp.task('build_www',gulp.series('clean','www','watch_www'));
gulp.task('default',gulp.series(
    'clean',
    gulp.parallel('www','build_app')
    ,gulp.parallel('server','watch_www')));