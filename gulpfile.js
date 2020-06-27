// Initialize Module
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    lineec = require('gulp-line-ending-corrector'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed');
    postcssunss = require('postcss-uncss')


// File Path Variables
var files = {
    scssPath: 'src/scss/**/*.scss',
    compiledCSS:'src/css/**/*.css',
    jsPath: 'src/js/script.js'
}


var vendor = {
    css:[
        'node_modules/bootstrap/dist/css/bootstrap.css',
        files.compiledCSS
    ],
    js: [
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        files.jsPath
    ]
}

const options = {
    html:['./*.html'],
    ignore:['img[data-loaded="true"]', '[data-loaded="true"] img', '.show', '.collapsing']
}

// Load Image files
var imgSRC = './src/assets/*',
    imgDEST = './dist/assets'

// Custom SASS Task to produce CSS
function scssTask(){
    return gulp.src(files.scssPath)
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(sass(
            {outputStyle:'expanded'}
        ).on('error',sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(lineec())
        .pipe(gulp.dest('./src/css'))
}

// Merge Custom CSS produced with other CSS files and minify it
function cssConcat() {
    return gulp.src(vendor.css)
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.init({loadMaps:true, largeFile:true}))
    .pipe(sass(
        {outputStyle:'expanded'}
    ).on('error',sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(lineec())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
}

// Merge Vendor JS and convert it to ES5 for support and minify
function jsTask(){
    return gulp.src(vendor.js)
        .pipe(concat('script.min.js'))
        .pipe(babel({
			presets: ['@babel/preset-env']
		}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

// , postcssunss(options)


function imgTask(){
    return gulp.src(imgSRC)
        .pipe(changed(imgDEST))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced:true}),
            imagemin.jpegtran({progressive:true}),
            imagemin.optipng({optimizationLevel:5})
        ]))
        .pipe(gulp.dest(imgDEST))
}

// CacheBusting Task
var cbString = new Date().getTime();
function cacheBustTask(){
    return gulp.src(options.html)
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(gulp.dest('.'))
}

// Watch Task (Check for changes being made)
function watchTask(){
    browserSync.init({
        server:{
            baseDir:'./'
        }
    });
    gulp.watch(files.scssPath, gulp.series(scssTask,cssConcat));
    gulp.watch(files.jsPath, jsTask);
    gulp.watch(imgSRC,imgTask);
    gulp.watch(['./*.html', './dist/js/script.min.js']).on('change',browserSync.reload);
}

// Default Task (Run)
exports.default = gulp.series(
    gulp.series(scssTask,cssConcat), 
    jsTask,
    imgTask,
    cacheBustTask,
    watchTask
);