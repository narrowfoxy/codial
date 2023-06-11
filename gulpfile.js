const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const path = require("path");
var cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");
const rename = require("gulp-rename");
const minify = require("gulp-minify");

gulp.task("css", async (done) => {
  gulp
    .src("./assets/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rev())
    .pipe(
      rename(function (path) {
        path.dirname = path.dirname.replace("scss", "css");
      })
    )
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));

  done();
});

gulp.task("js", async (done) => {
  gulp
    .src("./assets/**/*.js")
    .pipe(minify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
});
