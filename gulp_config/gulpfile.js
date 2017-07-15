
 var gulp = require('gulp');
 var plumber = require('gulp-plumber');
 var concat = require('gulp-concat');  
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify');  
var watch = require('gulp-watch');  
var cleanCSS = require('gulp-clean-css'); 
var autoprefixer = require('gulp-autoprefixer'); 
var jsFiles = '../work/scripts/**/*.js',  
    jsDest = '../done/js';
var cssFiles = '../work/css/**/*.css',  
    cssDest = '../done/css';
var browserSync = require('browser-sync').create();
var doneDir= '../done/';
var minify= require('gulp-html-minifier');
var sass = require('gulp-sass');
var	imagemin = require('gulp-image');
var notify = require('gulp-notify');
var	clean = require('gulp-clean');
var newer = require('gulp-newer');
gulp.task('watch:css', function () {
     gulp.watch(cssFiles, ['concatcss']);  
});
gulp.task('watch:html', function () {
     gulp.watch("../work/**/*.html", ['minimhtml']);  
});
gulp.task('watch:scripts', function () {
     gulp.watch(jsFiles, ['scripts']);  
});

gulp.task('scripts', function() {  
         return gulp.src(jsFiles)
         .pipe(plumber())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
    .pipe(plumber.stop())
        .pipe(gulp.dest(jsDest))
         .pipe(browserSync.reload({stream: true})); // prompts a reload after compilation
});

gulp.task('concatcss', function() {  
    return gulp.src(cssFiles)
    .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(rename('style.min.css'))
          .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
         .pipe(cleanCSS())
    .pipe(plumber.stop())
        .pipe(gulp.dest(cssDest))
         .pipe(browserSync.reload({stream: true})); // prompts a reload after compilation
});
gulp.task('minimhtml', function() {  
    return gulp.src("../work/**/*.html")
   		 .pipe(plumber())
        .pipe(minify({sortClassName:true,sortAttributes:true,removeRedundantAttributes :true,collapseWhitespace: true,collapseInlineTagWhitespace:true,removeComments:true,removeEmptyAttributes:true,removeAttributeQuotes:true}))  
    .pipe(plumber.stop())
     .pipe(gulp.dest(doneDir))
         .pipe(browserSync.reload({stream: true})); 
});

 gulp.task('watch:sass', function () {
     gulp.watch("../work/**/*.scss", ['sass']);  
});

gulp.task('sass', function () {
  return gulp.src('../work/*.scss')
  	.pipe(plumber())
    .pipe(sass().on('error', function(err) {
            notify().write(err);
            this.emit('end');
        }))

    .pipe(plumber.stop())
    .pipe(gulp.dest('../work/css/'));
});
 gulp.task('watch:img', function () {
     gulp.watch("../work/images/*", ['imgoptim']);  
});

 gulp.task('clean', function () {
  return gulp.src('../done')
        .pipe(clean({force: true}));
});
gulp.task('imgoptim', function () {
	return gulp.src('../work/images/**/*.*')
     .pipe(newer('../done/images'))
		.pipe(imagemin({
				pngquant: true,
				optipng: true,
				zopflipng: false,
				jpegRecompress: false,
				jpegoptim: true,
				mozjpeg: true,
				guetzli: false,
				gifsicle: true,
				svgo: true,
				concurrent: 10
			}))
		.pipe(gulp.dest('../done/images'))


	});
//server
gulp.task('BS', function() {
    browserSync.init({
        server: {
            baseDir: "../done"
        }
    });
    // gulp.watch(cssFiles, browserSync.reload);
    // gulp.watc(jsFiles, browserSync.reload);
    // gulp.watch( browserSync.reload);
});
// gulp.task('watch', ['BS'], function () {
//     // gulp.watch(jsFiles, ['scripts']);
//     // gulp.watch(cssFiles, ['concatcss']);
//     // gulp.watch(doneDir+"*.html").on('change', browserSync.reload);
// });

gulp.task('run',["imgoptim",'sass','scripts','concatcss',"minimhtml","BS",'watch:img','watch:sass',"watch:css","watch:scripts","watch:html"]);
