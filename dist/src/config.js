"use strict";
exports.__esModule = true;
var token = process.env.BOT_TOKEN;
var avatar = process.env.BOT_AVATAR;
var channel = process.env.PUBLISH_CHANNEL;
if (!token || !avatar || !channel) {
    throw 'Invalid config. See README for more informations.';
}
var config = {
    bot: {
        token: token,
        avatar: avatar,
        username: process.env.BOT_USERNAME || 'SDSGC-Birthday',
        command: process.env.COMMAND_PREFIX || '!birth'
    },
    server: {
        channel: channel
    }
};
exports["default"] = config;
