import Discord from 'discord.js';

import config from './src/config';
import { composeCommand } from './src/core';
import { missing, next, startCron } from './src/util';
import { addToCalendar, getCalendar, importCalendar } from './src/store';

const client = new Discord.Client();

client.on('message', async (message) => {
  const command = composeCommand(message);

  if (!command) {
    return;
  }

  if (command.name === 'help') {
    // @todo
    message.reply('@todo');
  }

  if (command.name === 'import' || command.name === 'add') {
    try {
      return message.reply(command.name === 'import' ? importCalendar(command.args[0]) : addToCalendar(command.args[0]));
    } catch (e) {
      return message.reply(`Import invalide. Exécutez \`${config.bot.command} help\` pour plus d'informations sur l'import.`);
    }
  }

  const calendar = getCalendar();

  if (command.name === 'export') {
    if (!Object.keys(calendar).length) {
      return message.reply(`Calendrier vide.`);
    }

    //@todo upload json file
    return message.reply(JSON.stringify(calendar));
  }

  if (command.name === 'missing') {
    return message.reply(await missing(calendar));
  }

  if (!Object.keys(calendar).length) {
    return message.reply(`Calendrier vide. Exécutez \`${config.bot.command} help\` pour plus d'informations sur l'import.`);
  }

  if (command.name === 'next') {
    return message.reply(next(calendar));
  }
});

client.login(config.bot.token);

startCron(client);
