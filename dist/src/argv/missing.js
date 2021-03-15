"use strict";
exports.__esModule = true;
exports.handler = exports.describe = exports.command = void 0;
var store_1 = require("../store");
var util_1 = require("../util");
exports.command = 'missing';
exports.describe = 'Check external database to get missing entries';
var handler = function () {
    util_1.missing(store_1.getCalendar());
};
exports.handler = handler;
