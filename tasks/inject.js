(function() {
  "use strict";

  var gulp = require("gulp");
  var fs = require("fs");
  var path = require("path");
  var crypto = require("crypto");
  var plumber = require("gulp-plumber");
  var inject = require("gulp-inject");
  var sequence = require("run-sequence");

  var config = require("../gulpconfig");

  gulp.task("injectJS", ["buildJS"], function() {

    return gulp.src(config.dist.inject)
      .pipe(plumber())
      .pipe(inject(gulp.src(config.dist.js, {read: false}), {
        transform: function(filepath) {
          var hash = crypto.createHash("md5").update(fs.readFileSync(path.join(__dirname, "..", filepath))).digest("hex");
          var fp = filepath.split("/");
          return "<script type=\"text/javascript\" src=\"dist/" + fp[fp.length - 1] + "?hash=" + hash + "\"></script>";
        }
      }))
      .pipe(gulp.dest("./"))
    ;
  });

  gulp.task("injectCSS", ["buildCSS"], function() {

    return gulp.src(config.dist.inject)
      .pipe(plumber())
      .pipe(inject(gulp.src(config.dist.css, {read: false}), {
        transform: function(filepath) {
          var hash = crypto.createHash("md5").update(fs.readFileSync(path.join(__dirname, "..", filepath))).digest("hex");
          var fp = filepath.split("/");
          return "<link rel=\"stylesheet\" type=\"text/css\" href=\"dist/" + fp[fp.length - 1] + "?hash=" + hash + "\"/>";
        }
      }))
      .pipe(gulp.dest("./"))
    ;
  });

  gulp.task("inject", function(cb) {
    sequence("injectJS", "injectCSS", cb);
  });

})();
