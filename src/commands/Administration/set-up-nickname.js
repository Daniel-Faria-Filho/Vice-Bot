const { SlashCommandBuilder } = require('discord.js')


module.exports = {
  data: new SlashCommandBuilder()
.setName('setup-nickname')
.setDescription('Setup your nickname')
  .addStringOption(options => options.setName('firstname').setDescription('Your First Name').setRequired(true))
  .addStringOption(options => options.setName('initials').setDescription('Your Operating Initials (EG:"DF")').setRequired(true))
  .addStringOption(options => options.setName('artcc').setDescription('Your Home ARTCC (optional)').setRequired(false)),

  async execute(interaction) {
    const firstName = interaction.options.getString('firstname');
    const initials = interaction.options.getString('initials');
    const artcc = interaction.options.getString('artcc') || '';
    const nickname = `${firstName} (${initials}) | ${artcc}`.trim();

    try {
      await interaction.member.setNickname(nickname);
      await interaction.reply(`Your nickname has been changed to: **${nickname}**`);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error trying to change your nickname!');
    }
  },
};