var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    fallback = require('connect-history-api-fallback'),
    log = require('connect-logger'),

    tsProject = ts.createProject('tsconfig.json'),

    directories = {
        appRoot: 'app',
        jsDist:  'dist'
    },

    input = {
        sass: [
            directories.appRoot + '/**/*.scss',
            'styles/**/*.scss'
        ],
        ts:   [
            directories.appRoot + '/**/*.ts'
        ]
    },
    output = {
        ts: directories.jsDist
    };

gulp.task('default', ['watch']);

gulp.task('css', function () {
    return gulp.src(input.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(prefixer('last 2 version'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('ts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(output.ts));
});

gulp.task('serve', function () {
    browserSync.init(
        {
            notify:         false,
            logLevel:       'info',
            logConnections: false,
            logFileChanges: false,
            injectChanges:  false, // workaround for Angular 2 styleUrls loading
            files:          ['./**/*.{html,htm,css,js}'],
            watchOptions:   {
                ignored: 'node_modules'
            },
            server:         {
                baseDir:    './',
                middleware: [
                    // Disabled Logs in console
                    // log({format: '%date %status %method %url'}),
                    fallback({
                        index:             '/index.html',
                        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // systemjs workaround
                    })
                ]
            }
        }
    )
});

gulp.task('watch', ['css', 'ts', 'serve'], function () {
    gulp.watch(input.ts, ['ts']);
    gulp.watch(input.sass, ['css']);
});
