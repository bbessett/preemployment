'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
// var livereload = require('gulp-livereload');
// var sourcemaps = require('gulp-sourcemaps');

// gulp.task('sass', function () {
//   .pipe(sourcemaps.init())
//   gulp.src('/scss/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('/css/'));
//     .pipe(sourcemaps.write())
// });

gulp.task('sass', function (done) {
	gulp.src('scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest('css'))
  done();
 });


gulp.task('clean', function() {
})


gulp.task('watch', () => {
  // livereload.listen(); 
  gulp.watch('scss/**/*.scss', (done) => {
      gulp.series(['sass'])(done);
  });
});

gulp.task('default', function(done) { // <--- Insert `done` as a parameter here...
gulp.series('clean','sass', 'watch')
done(); // <--- ...and call it here.
})