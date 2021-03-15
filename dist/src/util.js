"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.broadcastBirthdays = exports.startCron = exports.next = exports.composeDateIndex = exports.missing = void 0;
var match_all_1 = require("match-all");
var node_fetch_1 = require("node-fetch");
var config_1 = require("./config");
var store_1 = require("./store");
function missing(calendar) {
    return __awaiter(this, void 0, void 0, function () {
        var importedCharacters, result, allCharacters, _i, _a, match, missingCharacters, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    importedCharacters = Object.keys(store_1.exportCalendar(calendar));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, node_fetch_1["default"]('https://www.sdsgc.gg/characters')];
                case 2: return [4 /*yield*/, (_b.sent()).text()];
                case 3:
                    result = _b.sent();
                    allCharacters = [];
                    for (_i = 0, _a = match_all_1["default"](result, /img[^>]+character-icon[^>]+alt="(\w+)/gi).toArray(); _i < _a.length; _i++) {
                        match = _a[_i];
                        if (allCharacters.indexOf(match) === -1) {
                            allCharacters.push(match);
                        }
                    }
                    if (!allCharacters.length) {
                        return [2 /*return*/, 'Il semble que https://www.sdsgc.gg/ ait été mis à jour et ne peut être parsé.'];
                    }
                    missingCharacters = allCharacters
                        .filter(function (name) { return importedCharacters.indexOf(name) === -1; })
                        .sort(function (a, b) { return a > b ? 1 : -1; });
                    if (!missingCharacters.length) {
                        return [2 /*return*/, 'Le calendrier est à jour.'];
                    }
                    return [2 /*return*/, "Il manque les anniversaires des personnages suivants : " + missingCharacters.join(', ') + "."];
                case 4:
                    e_1 = _b.sent();
                    return [2 /*return*/, "Impossible de contacter https://www.sdsgc.gg/."];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.missing = missing;
function composeDateIndex(reference) {
    var month = "0" + (reference.getMonth() + 1);
    var date = "0" + reference.getDate();
    return month.slice(month.length - 2) + "-" + date.slice(date.length - 2);
}
exports.composeDateIndex = composeDateIndex;
function next(calendar) {
    var dates = Object.keys(calendar).sort(function (a, b) { return a < b ? -1 : 1; });
    if (!dates.length) {
        return '';
    }
    var currentDate = composeDateIndex(new Date(Date.now()));
    // Next birth date is for next year...
    if (dates[dates.length - 1] <= currentDate) {
        currentDate = '01-01';
    }
    var nextDate = dates.find(function (date) { return date >= currentDate; });
    return "Prochain anniversaire dans x (@todo) jours : " + calendar[nextDate].map(function (_a) {
        var name = _a.name;
        return name;
    }).join(', ') + ".";
}
exports.next = next;
function startCron(client) {
    function handle() {
        var now = new Date(Date.now());
        broadcastBirthdays(client, store_1.getCalendar()[composeDateIndex(new Date(Date.now()))] || []);
    }
    var now = new Date(Date.now());
    setTimeout(function () {
        handle();
        setInterval(handle, 3600000);
    }, 60000 * (59 - now.getMinutes()) + 1000 * (60 - now.getSeconds()));
}
exports.startCron = startCron;
function broadcastBirthdays(client, characters) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var defaultAvatar, defaultUsername, errors, e_2;
        var _this = this;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!characters.length) {
                        return [2 /*return*/];
                    }
                    defaultAvatar = ((_a = client.user) === null || _a === void 0 ? void 0 : _a.avatar) || config_1["default"].bot.avatar;
                    defaultUsername = ((_b = client.user) === null || _b === void 0 ? void 0 : _b.username) || config_1["default"].bot.username;
                    errors = [];
                    return [4 /*yield*/, characters
                            .map(function (character) { return function () { return __awaiter(_this, void 0, void 0, function () {
                            var e_3, channel, e_4;
                            var _a, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        _f.trys.push([0, 12, , 13]);
                                        if (!character.portrait) return [3 /*break*/, 6];
                                        _f.label = 1;
                                    case 1:
                                        _f.trys.push([1, 3, , 5]);
                                        return [4 /*yield*/, ((_a = client.user) === null || _a === void 0 ? void 0 : _a.setAvatar(character.portrait))];
                                    case 2:
                                        _f.sent();
                                        return [3 /*break*/, 5];
                                    case 3:
                                        e_3 = _f.sent();
                                        return [4 /*yield*/, ((_b = client.user) === null || _b === void 0 ? void 0 : _b.setAvatar(defaultAvatar))];
                                    case 4:
                                        _f.sent();
                                        return [3 /*break*/, 5];
                                    case 5: return [3 /*break*/, 8];
                                    case 6:
                                        if (!(((_c = client.user) === null || _c === void 0 ? void 0 : _c.avatar) !== defaultAvatar)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, ((_d = client.user) === null || _d === void 0 ? void 0 : _d.setAvatar(defaultAvatar))];
                                    case 7:
                                        _f.sent();
                                        _f.label = 8;
                                    case 8: return [4 /*yield*/, ((_e = client.user) === null || _e === void 0 ? void 0 : _e.setUsername(character.name))];
                                    case 9:
                                        _f.sent();
                                        channel = client.channels.cache.get("#" + config_1["default"].server.channel);
                                        if (!(channel === null || channel === void 0 ? void 0 : channel.isText())) return [3 /*break*/, 11];
                                        return [4 /*yield*/, channel.send("C'est mon anniversaire !")];
                                    case 10:
                                        _f.sent();
                                        _f.label = 11;
                                    case 11: return [3 /*break*/, 13];
                                    case 12:
                                        e_4 = _f.sent();
                                        errors.push({ character: character, message: e_4.message });
                                        return [3 /*break*/, 13];
                                    case 13: return [2 /*return*/];
                                }
                            });
                        }); }; })
                            .reduce(function (previousPromise, promise) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, previousPromise];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, promise()];
                                }
                            });
                        }); }, Promise.resolve())];
                case 1:
                    _f.sent();
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 6, , 7]);
                    if (!(((_c = client.user) === null || _c === void 0 ? void 0 : _c.avatar) !== defaultAvatar)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ((_d = client.user) === null || _d === void 0 ? void 0 : _d.setAvatar(defaultAvatar))];
                case 3:
                    _f.sent();
                    _f.label = 4;
                case 4: return [4 /*yield*/, ((_e = client.user) === null || _e === void 0 ? void 0 : _e.setUsername(defaultUsername))];
                case 5:
                    _f.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _f.sent();
                    errors.push({ message: e_2.message });
                    return [3 /*break*/, 7];
                case 7:
                    if (errors.length) {
                        throw "Errors occured!\n" + errors.map(function (_a) {
                            var character = _a.character, message = _a.message;
                            return ((character === null || character === void 0 ? void 0 : character.name) || 'While restoring config') + ": " + message;
                        }).join('\n');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.broadcastBirthdays = broadcastBirthdays;
