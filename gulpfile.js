var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
  src: 'playground/src',
  dist: 'playground/dist'
};


// SassDoc
var sassdoc = require('sassdoc');

// SassDoc task
gulp.task('sassdoc', function () {
  var options = {
    dest: paths.dist + '/sassdoc'
  };

  return gulp.src(paths.src + '/scss/**/*.scss')
    .pipe(plumber()) // Prevent pipe breaking
    .pipe(sassdoc(options))
    .pipe(reload({stream:true})) // Reload SassDoc page
  ;
});





// ~~~ Playground tasks ~~~ //


// Default tast
gulp.task('default', function () {
  runSequence(
    'clean',
    'sassdoc',
    'styles',
    'browser-sync',
    function () {
      // Watch task for scss files
      gulp.watch(paths.src + '/scss/**/*.scss', ['sassdoc', 'styles']);
    }
  );
});

// Delete all files (except .gitkeep) in dist folder
gulp.task('clean', function () {
  return del.sync([
    paths.dist + '/*',
    '!' + paths.dist + '/.gitkeep'
  ]);
});

// Compile scss files
gulp.task('styles', function () {
  return gulp.src(paths.src + '/scss/**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError({
        title: "Styles task failed",
        message: "<%= error.message %>"
      })
    }))
    .pipe(sass())
    .pipe(gulp.dest(paths.dist + '/css'));
  ;
});

// Create a static server for SassDoc
gulp.task('browser-sync', function() {
  return browserSync({
    logPrefix: "sassdoc-gulp-playground",
    notify: false,
    server:{
      baseDir: paths.dist + '/sassdoc'
    },
  });
});

