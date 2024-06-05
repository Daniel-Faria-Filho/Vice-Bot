const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const eventStatus = {};

// Define the command data using SlashCommandBuilder
const commandData = new SlashCommandBuilder()
    .setName('sendreminder')
    .setDescription('Send an instant reminder for an event')
    .addStringOption(option =>
        option.setName('tracon')
            .setDescription('The name of the event')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('date')
            .setDescription('The date of the event (E.G: "Today" or "Friday, Juanuary 22nd)')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('time')
            .setDescription('The time of the event (E.G: 9:00PM EST)')
            .setRequired(true));

// Export the command data and the execute function
module.exports = {
    data: commandData,
    async execute(interaction, client) {
        // Extract the event details from the interaction
        const eventDetails = {
            name: interaction.options.getString('tracon'),
            date: interaction.options.getString('date'),
            time: interaction.options.getString('time')
        };

        // Create an embedded message to track status using EmbedBuilder
        const statusEmbed = new EmbedBuilder()
            .setTitle(`Event Tracking: ${eventDetails.name}`)
            .setDescription(`Current status of the event:`)
            .setColor(0x0099ff)
            .addFields(
                { name: 'Confirmed Appearance', value: 'No one has confirmed just yet.' },
                { name: 'Running Late', value: 'No one said they are running late yet!' },
                { name: 'Canceled', value: 'No one has canceled yet!!' }
            )
            .setFooter({ text: 'Event Staff Bot' });

        // Send the status embed to the channel and store the message ID for future updates
        const statusMessage = await interaction.reply({ embeds: [statusEmbed], fetchReply: true });
        const statusMessageId = statusMessage.id;

        eventStatus[statusMessageId] = {
            confirmed: [],
            late: [],
            canceled: []
        };

        // Create buttons using ButtonBuilder with the statusMessageId
        const confirmButton = new ButtonBuilder()
            .setCustomId(`confirm-${statusMessageId}`)
            .setLabel('Confirm Appearance')
            .setStyle(ButtonStyle.Primary);

        const lateButton = new ButtonBuilder()
            .setCustomId(`late-${statusMessageId}`)
            .setLabel('Running 5-30 Minutes Late')
            .setStyle(ButtonStyle.Secondary);

        const leaveButton = new ButtonBuilder()
            .setCustomId(`leave-${statusMessageId}`)
            .setLabel('Leave Event')
            .setStyle(ButtonStyle.Danger);

        // Create an action row with the buttons using ActionRowBuilder
        const row = new ActionRowBuilder().addComponents(confirmButton, lateButton, leaveButton);

        // Create an embedded message for DMs using EmbedBuilder
        const dmEmbed = new EmbedBuilder()
            .setTitle(`Reminder: ${eventDetails.name}`)
            .setDescription(`Event Date: ${eventDetails.date}\nEvent Time: ${eventDetails.time}`)
            .setColor(0x0099ff)
            .setFooter({ text: 'Event Staff Bot' });

// Read the list of user IDs from the JSON file
fs.readFile('./src/eventStaff.json', (err, data) => {
    if (err) {
        console.error(err);
        return interaction.followUp({ content: 'Failed to read the staff list.', ephemeral: true });
    }

    const staffList = JSON.parse(data.toString());
    const eventCoordinatorId = interaction.user.id; // Event coordinator's user ID

    // Send the DM embed with buttons to each user in the staff list (except the event coordinator)
    staffList.forEach(userId => {
        if (userId !== eventCoordinatorId) {
            client.users.fetch(userId).then(user => {
                user.send({ embeds: [dmEmbed], components: [row] })
                    .then(() => console.log(`DM sent to user ID: ${userId}`))
                    .catch(error => console.error(`Failed to send DM to user ID: ${userId}`, error));
            }).catch(error => console.error(`Failed to fetch user ID: ${userId}`, error));
        }
    });
});
        }
    };