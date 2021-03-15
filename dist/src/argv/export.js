"use strict";
exports.__esModule = true;
exports.handler = exports.describe = exports.command = void 0;
var store_1 = require("../store");
exports.command = 'export';
exports.describe = 'Export current calendar under json format';
var handler = function () {
    store_1.exportCalendar();
};
exports.handler = handler;
