var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    cssnext = require('cssnext'),
    precss = require('precss'),
    stylelint = require('stylelint'),
    config = require('./stylelint.config.js'),
    gutil = require('gutil'),
    reporter = require('postcss-browser-reporter'),
    imagemin = require('gulp-imagemin')


var styleReporter = {
    'selector': 'html:before',
    'styles': {
        'color': '#fff',
        'background': '#FC4E61',
        'position': 'fixed',
        'right': '0',
        'bottom': '0',
        'margin': '15px',
        'padding': '20px',
        'line-height': '1.5em',
        'border-radius': '8px',
        'font-size': '18px',
        'font-family': 'sans-serif',
        'font-weight': '300',
        'z-index': '2000'
    }
}

// server connect
gulp.task('connect', function () {
    connect.server({
        root: './dist', //path to project
        livereload: true,
    });
});

// styles
gulp.task('styles', function () {
    var processors = [
        stylelint(config),
        cssnano,
        cssnext,
        precss,
        reporter(styleReporter),
    ];

    gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));

    return gulp.src('src/styles/main.pcss')
        .pipe(postcss(processors).on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

// compressor
gulp.task('compressor', function () {
    gulp.src('src/favicon/**/*').pipe(gulp.dest('dist/favicon'));
    gulp.src('src/video/*').pipe(gulp.dest('dist/video'));

    return gulp.src('src/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
        .pipe(gulp.dest('dist/img/'))
        .pipe(connect.reload());
});

// html
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

// watch
gulp.task('watch', function () {
    gulp.watch('src/styles/**/*.pcss', ['styles']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/img/**/*', ['compressor']);
});

gulp.task('default', ['html', 'styles', 'compressor', 'connect', 'watch']);
