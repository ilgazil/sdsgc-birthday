"use strict";
exports.__esModule = true;
exports.handler = exports.builder = exports.describe = exports.command = void 0;
var store_1 = require("../store");
exports.command = 'add <json>';
exports.describe = 'Add entries to the current calendar';
exports.builder = {
    json: {
        description: 'The json entries to add',
        type: 'string'
    }
};
var handler = function (argv) {
    store_1.addToCalendar(argv.json);
};
exports.handler = handler;
