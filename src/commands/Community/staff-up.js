const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const staffupCommand = new SlashCommandBuilder()
    .setName('staff-up')
    .setDescription('Schedule a TRACON staff up')
    .addStringOption(option =>
        option.setName('tracon')
            .setDescription('The TRACON to staff up (e.g., C90, N90)')
            .setRequired(true))
            .addStringOption(option =>
                option.setName('time')
                    .setDescription('What time will the staffup start?')
                    .setRequired(true)
            .addChoices(
			{ name: '1:00 AM EST', value: '1:00 AM EST' },
            { name: '2:00 AM EST', value: '2:00 AM EST' },
            { name: '3:00 AM EST', value: '3:00 AM EST' },
            { name: '4:00 AM EST', value: '4:00 AM EST' },
            { name: '5:00 AM EST', value: '5:00 AM EST' },
            { name: '6:00 AM EST', value: '6:00 AM EST' },
            { name: '7:00 AM EST', value: '7:00 AM EST' },
            { name: '8:00 AM EST', value: '8:00 AM EST' },
            { name: '9:00 AM EST', value: '9:00 AM EST' },
            { name: '10:00 AM EST', value: '10:00 AM EST' },
            { name: '11:00 AM EST', value: '11:00 AM EST' },
            { name: '12:00 PM EST', value: '12:00 PM EST' },
            { name: '1:00 PM EST', value: '1:00 PM EST' },
            { name: '2:00 PM EST', value: '2:00 PM EST' },
            { name: '3:00 PM EST', value: '3:00 PM EST' },
            { name: '4:00 PM EST', value: '4:00 PM EST' },
            { name: '5:00 PM EST', value: '5:00 PM EST' },
            { name: '6:00 PM EST', value: '6:00 PM EST' },
            { name: '7:00 PM EST', value: '7:00 PM EST' },
            { name: '8:00 PM EST', value: '8:00 PM EST' },
            { name: '9:00 PM EST', value: '9:00 PM EST' },
            { name: '10:00 PM EST', value: '10:00 PM EST' },
            { name: '11:00 PM EST', value: '11:00 PM EST' },
            { name: '12:00 AM EST', value: '12:00 AM EST' },
            ));

module.exports = {
    data: staffupCommand,
    async execute(interaction) {
        const tracon = interaction.options.getString('tracon');
        const time = interaction.options.getString('time');
        const creator = interaction.user;


        const embed = new EmbedBuilder()
            .setTitle('Staff Up Scheduled')
            .setDescription(`A staff up has been scheduled for the ${tracon} TRACON at ${time}.`)
            .setThumbnail('https://github.com/mmp/vice/blob/master/icons/tower-rounded-1024x1024.png?raw=true') // Replace with your logo URL
            .addFields(
                { name: 'TRACON', value: tracon },
                { name: 'Time', value: time }, 
                { name: 'Staffing', value: `${creator.toString()}` }
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('join_staffup')
                    .setLabel('Join Staffup')
                    .setStyle(ButtonStyle.Primary),
                    
                    new ButtonBuilder()
                    .setCustomId('leave_staffup')
                    .setLabel('Leave Staffup')
                    .setStyle(ButtonStyle.Secondary)
            ); 


        // Only the user who created the staffup can see the cancel button
        await interaction.reply({content: '<@&1246881661929394237>', embeds: [embed], components: [row], ephemeral: false });


        setTimeout(async () => {
            try {
                await interaction.deleteReply();
            } catch (error) {
                console.error('Failed to delete staffup message:', error);
            }
        }, 86400000); // 24 hours in milliseconds
    },
};
