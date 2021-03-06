const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class JumboCommand extends Command {
    constructor() {
        super('jumbo', {
           aliases: ['jumbo', 'emote', 'e'],
           category: 'Miscellaneous',
           description: 'Enlarge an emote by providing the emote or the emote ID',
           args: [{
              id: 'emote',
              type: 'string'
           }]
        });
    }

    async exec(message, args) {
      let emote = args.emote;     
      try {
          let emoji = this.client.emojis.cache.get(emote.split(':').pop().replace(/>/g, ''));
          return message.channel.send('', {
              files: [emoji.url]
          });
      } catch (e) {
          let id = emote.split(/:+/g).pop().replace(/>+/g, '');
          let extension = emote.startsWith('<a:') ? '.gif' : '.png';
          const res = await req(`https://cdn.discordapp.com/emojis/${id}${emote.startsWith('<a:') ? '.gif' : '.png'}?v=1`, 'GET').send()
          if (res.statusCode === 404) {
              return message.responder.error('**That is not a valid emote**');
          }
          return message.channel.send('', {
            files: [`https://cdn.discordapp.com/emojis/${id}${extension}?v=1`]
          });
      }
    }
}

module.exports = JumboCommand;