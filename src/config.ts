const token = process.env.BOT_TOKEN;
const avatar = process.env.BOT_AVATAR;
const channel = process.env.PUBLISH_CHANNEL;

if (!token || !avatar || !channel) {
  throw 'Invalid config. See README for more informations.'
}

const config = {
  bot: {
    token: token,
    avatar: avatar,
    username: process.env.BOT_USERNAME || 'Aide-de-camp',
    command: process.env.COMMAND_PREFIX || '!adc',
  },
  server: {
    channel: channel,
  },
};

export default config;
