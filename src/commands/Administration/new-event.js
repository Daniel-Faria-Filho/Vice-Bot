const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const staffupCommand = new SlashCommandBuilder()
    .setName('new-event')
    .setDescription('Schedule a TRACON Event')
    .addStringOption(option =>
        option.setName('tracon')
            .setDescription('The TRACON to staff up (e.g., C90, N90)')
            .setRequired(true))
            .addStringOption(option =>
                option.setName('date')
                    .setDescription('What day will the event be on?')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('time')
                    .setDescription('What time will the event start?')
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
        const date = interaction.options.getString('date');
        const creator = interaction.user;


        const embed = new EmbedBuilder()
            .setTitle('Event Scheduled')
            .setDescription(`An event has been scheduled for the ${tracon} TRACON at ${time}.`)
            .setThumbnail('https://github.com/mmp/vice/blob/master/icons/tower-rounded-1024x1024.png?raw=true')
            .addFields(
                { name: 'TRACON', value: tracon },
                { name: 'Date', value: date },
                { name: 'Time', value: time }, 
                { name: 'Staffing', value: `${creator.toString()}` }
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('join_event')
                    .setLabel('Signup For The Event')
                    .setStyle(ButtonStyle.Primary),
                    
                    new ButtonBuilder()
                    .setCustomId('leave_event')
                    .setLabel('Leave The Event')
                    .setStyle(ButtonStyle.Secondary)
            ); 


// Example command for creating a new event
function resetStaffList() {
    // Initialize an empty staff list
    const emptyList = [];

    // Write the empty list to the "eventStaff.json" file
    fs.writeFile('./src/eventStaff.json', JSON.stringify(emptyList, null, 2), (err) => {
        if (err) {
            console.error('Failed to reset the staff list:', err);
        } else {
            console.log('The staff list has been reset.');
        }
    });
}

// Call this function when a new event is created
// resetStaffList();
    

        await interaction.reply({embeds: [embed], components: [row], ephemeral: false });
        

    },
};
