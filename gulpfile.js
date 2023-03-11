const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");

function scss(path) {
    return gulp
        .src(path)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(
            sourcemaps.write("./", {
                sourceRoot: "./src/scss",
                includeContent: false
            })
        )
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
}

gulp.task("sass", function () {
    return scss("./src/scss/**/*.scss");
});

gulp.task("html", function () {
    return gulp
        .src(["./src/demo/**/*.html"])
        .pipe(
            fileInclude({
                prefix: "@",
                basepath: "src/modules"
            })
        )
        .pipe(gulp.dest("./dist"));
});

gulp.task(
    "default",
    gulp.series("sass", "html", function () {
        browserSync.init({
            server: {
                baseDir: ["./dist"],
                index: "index.html"
            },
            port: 63666,
            ui: {
                port: 63777
            }
        });

        const scssWatcher = gulp.watch(["./src/**/*.scss"], {
            ignoreInitial: false,
            usePolling: true
        });
        scssWatcher.on("change", function (fileName) {
            if (fileName.indexOf("modules") > -1)
                return scss("src/modules/_modules.scss");
            return scss(fileName);
        });
        gulp.watch(["./src/**/*.html"]).on(
            "change",
            gulp.series("html", browserSync.reload)
        );
    })
);
