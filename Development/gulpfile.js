const
	gulp = require('gulp'),
	del = require('del'),
	shell = require('child_process').exec,
	baseFolder = `./staging/`,
	htmlmin = require('gulp-htmlmin'),
	sass = require('gulp-sass'),
	terser = require('gulp-terser'),
	imagemin = require('gulp-imagemin')
;

sass.compiler = require('sass');

function resetStaging() {
	return del(['./staging/*']);
}

function eleventy() {
	return shell('eleventy');
}

function html() {
	return gulp.src(baseFolder + '**/*.html')
    .pipe(htmlmin({
			collapseBooleanAttributes: true,
			collapseInlineTagWhitespace: true,
			collapseWhitespace: true,
			conservativeCollapse: true,
			minifyCSS: true,
			minifyJS: true,
			preserveLineBreaks: true,
			removeComments: true,
			removeEmptyAttributes: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true
		}))
    .pipe(gulp.dest(baseFolder));
}

function css() {
	return gulp.src('sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest(baseFolder + 'css'));
}

function js() {
	return gulp.src(baseFolder + '**/*.js')
		.pipe(terser())
		.pipe(gulp.dest(baseFolder));
}

function img() {
	return gulp.src(baseFolder + '**/img/**')
		.pipe(imagemin([
			imagemin.svgo({plugins: [{removeViewBox: false}]})
		]))
		.pipe(gulp.dest(baseFolder));
}

function netlify() {
	return shell('netlify deploy --dir=staging --prod');
}

function browser() {
	return shell('start firefox.exe -private-window https://jkc-codes.netlify.com');
}

gulp.task('stage', gulp.series(resetStaging, eleventy, gulp.parallel(html, css, js, img), netlify, browser));