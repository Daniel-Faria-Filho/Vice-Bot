const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('VATBOT is now Online!');

        {try {
            client.user.setStatus("online")
            client.user.setActivity("the VICE Scopes 👀", {
                type: ActivityType.Watching,
              });
                    
                    

            
            } catch (error) {
                console.error(error);
            }
        }
    },
};