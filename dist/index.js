"use strict";
exports.__esModule = true;
var yargs_1 = require("yargs");
var addCommand = require("./src/argv/add");
var exportCommand = require("./src/argv/export");
var importCommand = require("./src/argv/import");
var missingCommand = require("./src/argv/missing");
var nextCommand = require("./src/argv/next");
var serveCommand = require("./src/argv/serve");
var parser = yargs_1["default"](process.argv.slice(2))
    .command(addCommand)
    .command(exportCommand)
    .command(importCommand)
    .command(missingCommand)
    .command(nextCommand)
    .command(serveCommand)
    .argv;
