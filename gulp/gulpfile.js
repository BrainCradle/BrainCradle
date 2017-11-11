// Include gulp
var gulp = require('gulp');
// Include plugins
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var del = require('del');
var now = new Date();

// Concatenate JS Files
gulp.task('js',['clean'], function () {
    return gulp.src(['../braincradleapp/app.js','../braincradleapp/components/**/*.js'])
      .pipe(concat('main.js'))
      .pipe(gulp.dest('build'));
});
// Concatenate CSS Files
gulp.task('css',['clean'], function () {
    return gulp.src(['../braincradleapp/components/**/*.css','../braincradleapp/app.css'])
      .pipe(concat('main.css'))
      .pipe(gulp.dest('build'));
});

// Move the lib folder
gulp.task('lib',['clean'], function(){
	return gulp.src(['../braincradleapp/lib/**/*'])
		.pipe(gulp.dest('build/lib'));
});


// Move the assets folder
gulp.task('assets',['clean'], function(){
	return gulp.src(['../braincradleapp/assets/**/*'])
		.pipe(gulp.dest('build/assets'));
});

// Move app icons
gulp.task('icons',['clean'], function(){
	return gulp.src(['../braincradleapp/*.ico'])
		.pipe(gulp.dest('build'));
});

// Move app.config.js:
gulp.task('appconfig', ['clean'], function () {
    return gulp.src(['../braincradleapp/app.config.js'])
		.pipe(gulp.dest('build'));
});

// Move the resources folder
gulp.task('resources',['clean'], function(){
	return gulp.src(['../braincradleapp/resources/**/*'])
		.pipe(gulp.dest('build/resources'));
});

// Move the component folder htmls
gulp.task('html',['clean'], function(){
	return gulp.src(['../braincradleapp/components/**/*.html'])
		.pipe(gulp.dest('build/components'));
});

// Add timestamp to avoid cached files
gulp.task('index',['clean'], function () {
	return gulp.src('../braincradleapp/index.html')
	    .pipe(htmlreplace({
			'css': 'main.css?v='+now.getTime(),
			'appconfigjs': 'app.config.js?v='+now.getTime(),
			'js': 'main.js?v='+now.getTime()
		}))
    	.pipe(gulp.dest('build'));
});
// Add timestamp to avoid cached files
gulp.task('print',['clean'], function () {
    return gulp.src('../braincradleapp/print.html')
        .pipe(htmlreplace({
            'css': 'main.css?v='+now.getTime(),
            'appconfigjs': 'app.config.js?v='+now.getTime(),
            'js': 'main.js?v='+now.getTime()
        }))
        .pipe(gulp.dest('build'));
});

// Delete the build folder
gulp.task('clean', function () {
	return del(['build/**/*']);
});

// Default Task
gulp.task('default', ['print','index', 'lib', 'assets', 'icons', 'resources', 'js', 'css', 'html', 'appconfig']);
