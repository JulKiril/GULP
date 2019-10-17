const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');/*добавляє префікси для нормальної роботи в інших браузерах*/
const concat = require('gulp-concat');/*деколи недобре, бо потрібна послідовність js, в якій вони йдуть. Для цього створюється json і налаштовуєш послідовність dependencies*/
const cssnano = require('gulp-cssnano');/*для мініфікації*/
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
// const uglify = require('gulp-uglify');/*мініфікувати*/
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browsersync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

const paths = {
    styles: {
        src: 'app/style/**/*.scss',
        dest: 'build/css'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/scripts'
    },
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    },
    images: {
        src: 'app/images/*.*',
        dest: 'build/images'
    }
}

function browserSync(done){
    browsersync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    });
    done();
}


function styles(){
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(autoprefixer({
            browsers: ['last 3 versions','ie 8','ie 9']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browsersync.stream())
}

function html(){
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browsersync.stream())
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browsersync.stream())
}

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.images.src, images);
    gulp.watch('./app/*.html').on('change',browsersync.reload);
}

function clean(){
    return del('build/*')
}

 gulp.task('default', gulp.parallel(watch,browserSync,gulp.series(clean, gulp.parallel(styles, scripts, html, images))));
