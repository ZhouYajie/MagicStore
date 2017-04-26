
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');		//压缩js
var minifyCSS = require('gulp-minify-css');		//压缩css
var htmlminify = require("gulp-html-minify");	//压缩html
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');		//重命名

gulp.task('server',function(){
    connect.server({
        root:'dist',  //以谁为服务器根目录
        port:8888,  // 端口号
        livereload:true
    });
});

gulp.task('index',function(){
    return gulp.src('*.html')
    		.pipe(htmlminify())
    		.pipe(gulp.dest('dist'))
    		.pipe(connect.reload());
});
gulp.task('img',function(){
    return gulp
    		.src('img/*.{jpg,png}')
    		.pipe(imagemin())
    		.pipe(gulp.dest('dist/img'))
    		.pipe(connect.reload());
});
gulp.task('sass',function(){
    return gulp
    		.src('sass/*.scss')
    		.pipe(sass())
    		.pipe(minifyCSS())
    		.pipe(gulp.dest('dist/css'))
    		.pipe(connect.reload());
});
gulp.task('js',function(){
    return gulp
        .src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});
//gulp.task('js',function(){
//  return gulp
//      .src(['js/index.js','js/list.js'])
//      .pipe(concat('three.js'))
//      .pipe(rename('three.min.js'))
//      .pipe(uglify())
//      .pipe(gulp.dest('dist/js'))
//      .pipe(connect.reload());
//});

gulp.task('watch',function(){
    gulp.watch('*.html',['index']);
    gulp.watch('img/**/*',['img']);
    gulp.watch('data/*',['data']);
    gulp.watch('sass/*.scss',['sass']);
    gulp.watch('js/*.js',['js']);
});

gulp.task('default',['server','watch']);

