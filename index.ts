import Discord from 'discord.js';
import config from './config.json';

import { composeCommand } from './src/core';
import { next } from './src/lib';
import { addToCalendar, Character, getCalendar, importCalendar } from './src/store';

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
      return message.reply(`Import invalide. Exécutez \`${config.prefix} help\` pour plus d'informations sur l'import.`);
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

  if (!Object.keys(calendar).length) {
    return message.reply(`Calendrier vide. Exécutez \`${config.prefix} help\` pour plus d'informations sur l'import.`);
  }

  if (command.name === 'next') {
    return message.reply(next(calendar));
  }

  if (command.name === 'simulate') {
    const characters = calendar[command.args[0]];

    if (!characters.length) {
      return message.reply(`Aucun anniversaire à souhaiter le ${command.args[0]}.`);
    }

    return message.reply(`Le ${command.args[0]} est l'anniversaire de ${characters.map(({ name }) => name).join(', ')}.`);
  }
});

async function broadcastBirthdays(characters: Character[]) {
  if (!characters) {
    return;
  }

  const defaultUsername = client.user?.username || config.defaultUsername;
  const defaultAvatar = client.user?.avatar || config.defaultAvatar;

  characters.forEach(async (character) => {
    try {
      if (character.portrait) {
        try {
          await client.user?.setAvatar(character.portrait);
        } catch (e) {
          await client.user?.setAvatar(defaultAvatar);
        }

        await client.user?.setUsername(character.name);
      }

      const channel = client.channels.cache.get(config.publishChannel);

      if (channel?.isText()) {
        channel.send(`C'est mon anniversaire !`);
      }
    } catch (e) {
      console.error(`An error occured while broadcasting for ${character.name}: ${e.message}`);
    }
  });

  try {
    await client.user?.setAvatar(defaultAvatar);
    await client.user?.setUsername(defaultUsername);
  } catch (e) {
    console.error(`An error occured while restoring bot avatar and userName: ${e.message}`);
  }
}

client.login(config.botToken);
