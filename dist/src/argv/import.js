"use strict";
exports.__esModule = true;
exports.handler = exports.builder = exports.describe = exports.command = void 0;
var store_1 = require("../store");
exports.command = 'import <json>';
exports.describe = 'Erase current calendar with a fresh new one';
exports.builder = {
    json: {
        description: 'The json calendar to import',
        type: 'string'
    }
};
var handler = function (argv) {
    store_1.importCalendar(argv.json);
};
exports.handler = handler;
