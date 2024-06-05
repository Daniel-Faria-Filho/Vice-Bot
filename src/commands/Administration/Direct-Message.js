const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
.setName('dm')
.setDescription('Dm a user')
.addUserOption(options => options.setName('user').setDescription('The user to dm').setRequired(true))
.addStringOption(options => options.setName('content').setDescription('The message to sent to the user').setRequired(true)),
async execute(interaction) {
  const target = await interaction.options.getUser('user')
  const message= await interaction.options.getString('content')

  await interaction.reply ({content: 'Message has been sent!' , ephemeral: true })
  

  await target.send (`(The following message was sent by **Vice's** Administration Department): ${message}`)}
 
}