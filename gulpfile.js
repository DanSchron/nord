"use strict";
/*
++++++++++++++++++++++++++++++++++++++++++++++++++++
title      Project Gulp File                       +
project    nord                                    +
repository https://github.com/arcticicestudio/nord +
author     Arctic Ice Studio                       +
email      development@arcticicestudio.com         +
copyright  Copyright (C) 2017                      +
++++++++++++++++++++++++++++++++++++++++++++++++++++

[References]
Babel
  https://babeljs.io
Gulp
  http://gulpjs.com
npmjs
  https://www.npmjs.com
*/
/*+---------------+
  + Configuration +
  +---------------+*/
const config = {
  project: {
    id: "nord",
    name: "Nord",
    version: "0.2.0",
    repository: "https://github.com/arcticicestudio/nord",
    author: "Arctic Ice Studio",
    email: "development@arcticicestudio.com"
  },
  build: {
    base: "./build",
    css: "./build/css",
    jsdoc: "./build/docs/jsdoc",
    sassdoc: "./build/docs/sassdoc"
  },
  src: {
    sass: "./src/sass"
  },
  tasks: {
    compilation: {
      sass: {
        extensions: {
          input: ["scss"],
          output: "css"
        },
        options: {
          indentedSyntax: false,
          indentType: "space",
          indentWidth: 2,
          linefeed: "lf",
          outputStyle: "expanded",
          precision: 5,
          sourceComments: false
        }
      }
    }
  }
};

const javaScriptSources = ["gulpfile.js", "src/js/**/*.js"];
const lesscssSources = ["src/lesscss/**/*.less"];
const scssSources = ["src/sass/**/*.scss"];

/*+---------+
  + Imports +
  +---------+*/
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp-help")(require("gulp"));
const jsdoc = require("gulp-jsdoc3");
const path = require("path");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sassdoc = require("sassdoc");
const stylelint = require("gulp-stylelint");

/*+-------+
  + Tasks +
  +-------+*/
/**
 * Cleans the whole build folder.
 *
 * @since 0.1.0
 */
gulp.task("clean", "Cleans the whole build folder", () => {
  del(config.build.base);
});

/**
 * Cleans the CSS build folder.
 *
 * @since 0.1.0
 */
gulp.task("clean-css", "Cleans the CSS build folder", () => {
  del(config.build.css);
});

/**
 * Cleans the documentation build folder.
 *
 * @since 0.1.0
 */
gulp.task("clean-docs", "Cleans the documentation build folder", () => {
  del(config.build.sassdoc);
});

/**
 * Cleans the test documentation build folder.
 *
 * @since 0.3.0
 */
gulp.task("clean-test-docs", "Cleans the test documentation build folder", () => {
  del(config.build.jsdoc);
});

/**
 * Compiles the Sass CSS template.
 *
 * @since 0.1.0
 */
gulp.task("compile-css-template", "Compiles the Sass CSS template", () => {
  return gulp.src(path.join(config.src.sass, "/template-css." + config.tasks.compilation.sass.extensions.input))
    .pipe(plumber())
    .pipe(sass(config.tasks.compilation.sass.options).on("error", sass.logError))
    .pipe(rename("/nord." + config.tasks.compilation.sass.extensions.output))
    .pipe(gulp.dest(config.build.css));
});

/**
 * Shows the help.
 *
 * @since 0.1.0
 */
gulp.task("default", ["help"]);

/**
 * Creates the JSDocs.
 *
 * @since 0.3.0
 */
gulp.task("jsdoc", "Creates the JSDocs", () => {
  gulp.src(javaScriptSources)
    .pipe(jsdoc({
      opts: {
        destination: config.build.jsdoc,
        template: "./node_modules/minami"
      },
      tags: {
        allowUnknownTags: false
      }
    }));
});

/**
 * Runs all lint tasks.
 *
 * @since 0.3.0
 */
gulp.task("lint", "Runs all lint tasks", ["lint-js", "lint-lesscss", "lint-scss"]);

/**
 * Lints all JavaScript sources.
 *
 * @since 0.3.0
 */
gulp.task("lint-js", "Lints all JavaScript sources", () => {
  return gulp.src(javaScriptSources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/**
 * Lints all LESSCSS sources.
 *
 * @since 0.3.0
 */
gulp.task("lint-lesscss", "Lints all LESSCSS sources", () => {
  return gulp.src(lesscssSources)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [
        {formatter: "verbose", console: true}
      ]
    }));
});

/**
 * Lints all Sass SCSS sources.
 *
 * @since 0.3.0
 */
gulp.task("lint-scss", "Lints all Sass SCSS sources", () => {
  return gulp.src(scssSources)
    .pipe(stylelint({
      failAfterError: true,
      reporters: [
        {formatter: "verbose", console: true}
      ]
    }));
});

/**
 * Creates the Sassdoc documentation.
 *
 * @since 0.1.0
 */
gulp.task("sassdoc", "Creates the Sassdoc documentation", () => {
  return gulp.src(path.join(config.src.sass, "/**/*." + config.tasks.compilation.sass.extensions.input))
    .pipe(sassdoc());
});
