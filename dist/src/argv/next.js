"use strict";
exports.__esModule = true;
exports.handler = exports.describe = exports.command = void 0;
var store_1 = require("../store");
var util_1 = require("../util");
exports.command = 'next';
exports.describe = 'Provide incoming birthdays';
var handler = function () {
    util_1.next(store_1.getCalendar());
};
exports.handler = handler;
