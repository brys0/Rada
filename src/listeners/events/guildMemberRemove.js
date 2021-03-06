const { Listener } = require('discord-akairo');

class GuildMemberRemoveListener extends Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    async exec(member) {
        let channel = this.client.settings.get(member.guild.id, 'wc', false);
        let message = this.client.settings.get(member.guild.id, 'lm', false);
        if (!channel) return;
        if (!message) return;
        message = message.replace(/{tag}/gi, member.user.tag);
        message = message.replace(/{user}/gi, member.user);
        message = message.replace(/{userid}/gi, member.user.id);
        message = message.replace(/{username}/gi, member.user.username);
        message = message.replace(/{membercount}/gi, member.guild.memberCount);
        message = message.replace(/{servername}/gi, member.guild.name);
        try {
            member.guild.channels.cache.get(channel).send(message);
        } catch (e) {
            if (e.includes('Missing Permissions')) this.client.users.cache.get(member.guild.owner.id)
                .send(`I tried to send a message in ${member.guild.channels.cache.get(channel)} for a user leaving, however i was missing permissions to do so.\nPlease check the permissions for my role/channel to make sure i have the required permissions.`)
                .then(() => { })
                .catch((err) => { return; })
        }
    }
};
module.exports = GuildMemberRemoveListener;