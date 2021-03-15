"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getCalendar = exports.addToCalendar = exports.exportCalendar = exports.importCalendar = exports.sortImport = exports.composeImport = exports.composeCalendar = exports.isImport = exports.isImportEntry = exports.InvalidImportError = void 0;
;
var InvalidImportError = /** @class */ (function (_super) {
    __extends(InvalidImportError, _super);
    function InvalidImportError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidImportError;
}(Error));
exports.InvalidImportError = InvalidImportError;
;
var calendar = {};
function isImportEntry(character) {
    if (!character || typeof character !== 'object') {
        return false;
    }
    if ('portrait' in character && typeof character['portrait'] !== 'string') {
        return false;
    }
    if (!(/\d{2}-\d{2}/.exec(character['birthdate']))) {
        return false;
    }
    if ('gift' in character && typeof character['gift'] !== 'string') {
        return false;
    }
    if ('location' in character && typeof character['location'] !== 'string') {
        return false;
    }
    return true;
}
exports.isImportEntry = isImportEntry;
function isImport(importedCalendar) {
    if (!importedCalendar || typeof importedCalendar !== 'object') {
        return false;
    }
    return Object.keys(importedCalendar).every(function (name) {
        if (!name) {
            return false;
        }
        return isImportEntry(importedCalendar[name]);
    });
}
exports.isImport = isImport;
function composeCalendar(input) {
    return Object.keys(input).reduce(function (calendar, name) {
        var birthdate = input[name].birthdate;
        if (!(birthdate in calendar)) {
            calendar[birthdate] = [];
        }
        calendar[birthdate].push(__assign(__assign({}, input[name]), { name: name }));
        return calendar;
    }, {});
}
exports.composeCalendar = composeCalendar;
function composeImport(calendar) {
    return Object.keys(calendar).reduce(function (output, date) {
        calendar[date].forEach(function (character) { return output[character.name] = {
            portrait: character.portrait,
            birthdate: character.birthdate,
            gift: character.gift,
            location: character.location
        }; });
        return output;
    }, {});
}
exports.composeImport = composeImport;
function sortImport(input) {
    return Object.keys(input).sort(function (a, b) { return a > b ? 1 : -1; }).reduce(function (sortedInput, name) {
        sortedInput[name] = input[name];
        return sortedInput;
    }, {});
}
exports.sortImport = sortImport;
function importCalendar(raw) {
    var importedCalendar = JSON.parse(raw);
    if (!isImport(importedCalendar)) {
        throw new InvalidImportError('Invalid import');
    }
    calendar = composeCalendar(sortImport(importedCalendar));
    return "Calendrier import\u00E9 avec succ\u00E8s.";
}
exports.importCalendar = importCalendar;
function exportCalendar(calendar) {
    return sortImport(composeImport(calendar || getCalendar()));
}
exports.exportCalendar = exportCalendar;
function addToCalendar(raw) {
    var input = JSON.parse(raw);
    if (!isImport(input)) {
        throw new InvalidImportError('Invalid import');
    }
    calendar = composeCalendar(sortImport(__assign(__assign({}, composeImport(calendar)), input)));
    return "Calendrier mis \u00E0 jour avec succ\u00E8s.";
}
exports.addToCalendar = addToCalendar;
function getCalendar() {
    return calendar;
}
exports.getCalendar = getCalendar;
