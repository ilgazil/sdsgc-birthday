import Discord from 'discord.js';
import config from './config.json';

import { composeCommand } from './src/core';
import { next } from './src/lib';
import { addToCalendar, getCalendar, importCalendar } from './src/store';

const client = new Discord.Client();

client.on('message', async (message) => {
  try {
    const { command, args } = composeCommand(message);

    if (command === 'help') {
      // @todo
      message.reply('@todo');
    }

    if (command === 'import' || command === 'add') {
      try {
        return message.reply(command === 'import' ? importCalendar(args[0]) : addToCalendar(args[0]));
      } catch (e) {
        return message.reply(`Import invalide. Exécutez \`${config.prefix} help\` pour plus d'informations sur l'import.`);
      }
    }

    const calendar = getCalendar();

    if (command === 'export') {
      if (!Object.keys(calendar).length) {
        return message.reply(`Calendrier vide.`);
      }

      //@todo upload json file
      return message.reply(JSON.stringify(calendar));
    }

    if (!Object.keys(calendar).length) {
      return message.reply(`Calendrier vide. Exécutez \`${config.prefix} help\` pour plus d'informations sur l'import.`);
    }

    if (command === 'next') {
      return message.reply(next(calendar));
    }

    if (command === 'simulate') {
      const characters = calendar[args[0]];

      if (!characters) {
        return message.reply(`Aucun anniversaire à souhaiter le ${args[0]}.`);
      }

      characters.forEach(async (character) => {
        try {
          try {
            await client.user.setAvatar(character.portrait);
          } catch (e) {
            await client.user.setAvatar(config.defaultAvatar);
          }

          await client.user.setUsername(character.name);

          const channel = client.channels.cache.get(config.publishChannel);

          if (channel.isText()) {
            channel.send(`Si c'était le ${args[0]}, ça serait mon anniversaire.`);
          }

        } catch (e) {
          message.reply(`Une erreur est survenue en souhaitant son anniversaire à ${character.name}: ${e.message}`);
        }
      });

      await client.user.setAvatar(config.defaultAvatar);
    }
  } catch (e) {
    return;
  }
});

client.login(config.botToken);
