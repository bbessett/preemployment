'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// var livereload = require('gulp-livereload');
// var sourcemaps = require('gulp-sourcemaps');

// gulp.task('sass', function () {
//   .pipe(sourcemaps.init())
//   gulp.src('/scss/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('/css/'));
//     .pipe(sourcemaps.write())
// });

var input = 'scss/**/*.scss';
var output = 'css';


gulp.task('prod', function (done) {
	gulp.src('scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest(output))
  done();
 });

 var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
}; 

gulp.task('sass', function (done) {
	gulp.src(input)
	.pipe(sourcemaps.init())
	.pipe(sass(sassOptions).on('error', sass.logError))
	.pipe(sourcemaps.write())
	  //   .pipe(autoprefixer({
    //         browsers: ['last 99 versions'],
    //         cascade: false
    // }))
  .pipe(gulp.dest(output))
  done();
 });


gulp.task('clean', function() {
})


gulp.task('watch', () => {
  // livereload.listen(); 
  gulp.watch(input, (done) => {
      gulp.series(['sass'])(done);
  });
});

gulp.task('default', function(done) { // <--- Insert `done` as a parameter here...
gulp.series('clean','sass', 'watch')
done(); // <--- ...and call it here.
})