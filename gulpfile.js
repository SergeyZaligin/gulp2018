const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const uglify = require('gulp-uglifyjs');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch("build").on('change', browserSync.reload);
});

gulp.task('pug', function() {
	return gulp
		.src('src/pug/**/*.pug')
		.pipe(pug({
			pretty: false,
		}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.stream());
});

gulp.task('sass', function() {
	return gulp
		.src('src/static/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(csso())
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
		}))
		.pipe(plumber())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', function() {
	return gulp
	  .src('src/static/js/**/*.js')
	  .pipe(
		babel({
		  presets: ['es2015'],
		})
	  )
	  .pipe(concat('main.js'))
	  .pipe(uglify())
	  .pipe(plumber())
	  .pipe(rename({suffix: '.min'}))
	  .pipe(gulp.dest('build/js'))
	  .pipe(browserSync.stream());
  });

  gulp.task('img', function() {
	return gulp
	  .src('src/static/images/**/*')
	  .pipe(
		imagemin({
		  progressive: true,
		  svgoPlugins: [{ removeViewBox: false }],
		  use: [pngquant()],
		  interlaced: true,
		})
	  )
	  .pipe(rename({suffix: '.min'}))
	  .pipe(gulp.dest('build/images'))
	  .pipe(browserSync.stream());
  });

gulp.task('watch', function() {
	gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
	gulp.watch('src/static/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('src/static/js/**/*.js', gulp.series('js'));
	gulp.watch('src/static/images/**/*', gulp.series('img'));
});

gulp.task('default', gulp.series(gulp.parallel('pug', 'sass', 'js', 'img'), gulp.parallel('watch', 'browser-sync')));
