const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const path = require('path');
const sendreminderCommand = require('./commands/Administration/sendreminder.js');
const eventStatus = {};

require ("dotenv").config ({debug:true});
const { Client, GatewayIntentBits, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    ]
  }); 
 

client.commands = new Collection();


const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.CLIENT_TOKEN)
})();



client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName, options } = interaction;
  
    if (commandName === 'modifynickname') {
      const firstName = options.getString('firstname');
      const initials = options.getString('initials');
      const artcc = options.getString('artcc') || '';
      const nickname = `${firstName} ${initials} | ${artcc}`.trim();
  
      try {
        await interaction.member.setNickname(nickname);
        await interaction.reply(`Your nickname has been changed to: ${nickname}`);
      } catch (error) {
        console.error(error);
        await interaction.reply('There was an error trying to change your nickname!');
      }
    }
  });

  const { ButtonInteraction} = require('discord.js');

// This is a hypothetical function that handles all button interactions
async function handleButtonInteraction(interaction) {
    // Ensure this is a button interaction
    if (!(interaction instanceof ButtonInteraction)) return;

    const user = interaction.user;
    const customId = interaction.customId;
    const originalMessage = interaction.message;

    if (customId === 'join_staffup') {
        // Logic to add the user to the staffup list
        const updatedEmbed = new EmbedBuilder(originalMessage.embeds[0]);
        const staffingField = updatedEmbed.data.fields.find(field => field.name === 'Staffing');
        const staffList = staffingField.value.split('\n');
        
        // Check if the user is already in the list to avoid duplicates
        if (!staffList.includes(user.toString())) {
            staffList.push(user.toString());
            staffingField.value = staffList.join('\n');
            
            
            // Update the embed with the new list of users
            await interaction.update({ embeds: [updatedEmbed] });
            await interaction.followUp({ content: 'You have joined the staffup!', ephemeral: true });

            
            }
        } else if (customId === 'leave_staffup') {
            // Logic to remove the user from the staffup list
            const updatedEmbed = new EmbedBuilder(originalMessage.embeds[0]);
            const staffingFieldIndex = updatedEmbed.data.fields.findIndex(field => field.name === 'Staffing');
            
            if (staffingFieldIndex !== -1) {
                const staffingField = updatedEmbed.data.fields[staffingFieldIndex];
                let staffList = staffingField.value.split('\n');
                staffList = staffList.filter(staffMember => !staffMember.includes(user.id));
                staffingField.value = staffList.join('\n') || '';
                
                // Update the embed with the new list of users
                await interaction.update({ embeds: [updatedEmbed] });
                await interaction.followUp({ content: 'You have left the staffup.', ephemeral: true });
            }
        }
    }


        // This is a hypothetical function that handles all button interactions for events

    
async function handleButtonInteraction(interaction) {
    // Ensure this is a button interaction
    if (!(interaction instanceof ButtonInteraction)) return;

    const user = interaction.user;
    const customId = interaction.customId;
    const originalMessage = interaction.message;

    if (customId === 'join_event') {
        // Logic to add the user to the staffup list
        const updatedEmbed = new EmbedBuilder(originalMessage.embeds[0]);
        const staffingField = updatedEmbed.data.fields.find(field => field.name === 'Staffing');
        const staffList = staffingField.value.split('\n');
        const userId = interaction.user.id

        //Add/Remove staff member
        addUserToEventStaff(userId);
        removeUserFromEventStaff(userId);
        
        // Check if the user is already in the list to avoid duplicates
        if (!staffList.includes(user.toString())) {
            staffList.push(user.toString());
            staffingField.value = staffList.join('\n');
            
            
            // Update the embed with the new list of users
            await interaction.update({ embeds: [updatedEmbed] });
            await interaction.followUp({ content: 'You have successfuly signed up for the event!', ephemeral: true });

            
            }
        } else if (customId === 'leave_event') {
            // Logic to remove the user from the staff list
            const updatedEmbed = new EmbedBuilder(originalMessage.embeds[0]);
            const staffingFieldIndex = updatedEmbed.data.fields.findIndex(field => field.name === 'Staffing');
            
            if (staffingFieldIndex !== -1) {
                const staffingField = updatedEmbed.data.fields[staffingFieldIndex];
                let staffList = staffingField.value.split('\n');
                staffList = staffList.filter(staffMember => !staffMember.includes(user.id));
                staffingField.value = staffList.join('\n') || '';
                
                // Update the embed with the new list of users
                await interaction.update({ embeds: [updatedEmbed] });
        
                // Read the "eventStaff.json" file and update it
                fs.readFile('./src/eventStaff.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return interaction.followUp({ content: 'Failed to read the event list.', ephemeral: true });
                    }
        
                    let jsonStaffList = JSON.parse(data);
                    const index = jsonStaffList.indexOf(user.id);
        
                    if (index !== -1) {
                        jsonStaffList.splice(index, 1); // Remove the user ID from the array
        
                        fs.writeFile('./src/eventStaff.json', JSON.stringify(jsonStaffList, null, 2), (writeErr) => {
                            if (writeErr) {
                                console.error(writeErr);
                                return interaction.followUp({ content: 'Failed to update the staff list.', ephemeral: true });
                            }
        
                            // Confirm the user has been removed
                            interaction.followUp({ content: 'You have left the event roster.', ephemeral: true });
                        });
                    } else {
                        // The user was not found in the list
                        interaction.followUp({ content: 'You are not on the event list.', ephemeral: true });
                    }
                });
            }
        }}





    function addUserToEventStaff(userId) {
        fs.readFile('./src/eventStaff.json', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
    
            let staffList = JSON.parse(data.toString());
            if (!staffList.includes(userId)) {
                staffList.push(userId);
    
                fs.writeFile('./src/eventStaff.json', JSON.stringify(staffList, null, 2), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                    } else {
                        console.log('User ID added to event list.');
                    }
                });
            } else {
                console.log('User ID already exists in the event list.');
            }
        });
    }


    function removeUserFromEventStaff(userId) {
        fs.readFile('./src/eventStaff.json', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
    
            let staffList = JSON.parse(data.toString());
            const index = staffList.indexOf(userId);
            if (index !== -1) {
                staffList.splice(index, 1); // Remove the user
    
                fs.writeFile('./src/eventStaff.json', JSON.stringify(staffList, null, 2), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                    } else {
                        console.log('User ID removed from event list.');
                    }
                });
            } else {
                console.log('User ID not found in the event staff list.');
            }
        });
    }

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for button interactions
client.on('interactionCreate', async buttonInteraction => {
    if (!buttonInteraction.isButton()) return;

    const [action, statusMessageId] = buttonInteraction.customId.split('-');
    const channel = await client.channels.fetch('1213940076955050105');

    try {
        // Attempt to fetch the message from the correct channel
        const statusMessage = await channel.messages.fetch(statusMessageId);

        // Initialize the status for the event if it doesn't exist
        if (!eventStatus[statusMessageId]) {
            eventStatus[statusMessageId] = {
                confirmed: [],
                late: [],
                canceled: []
            };
        }

        const userStatus = eventStatus[statusMessageId];
        const userId = buttonInteraction.user.id;

        // Update the user's status based on which button they pressed
        if (action === 'confirm') {
            userStatus.confirmed.push(userId);
        } else if (action === 'late') {
            userStatus.late.push(userId);
        } else if (action === 'leave') {
            userStatus.canceled.push(userId);
        }

 // Update the status embed with the new information
const updatedEmbed = new EmbedBuilder()
.setTitle(`Event Tracking: ${statusMessage.embeds[0].title}`)
.setDescription(`Current status of the event:`)
.setColor(0x0099ff)
.addFields(
    { name: 'Confirmed Event Appearance', value: userStatus.confirmed.length > 0 ? userStatus.confirmed.map(id => `<@${id}>`).join('\n') : 'No one has confirmed yet' },
    { name: 'Running Late', value: userStatus.late.length > 0 ? userStatus.late.map(id => `<@${id}>`).join('\n') : 'No one said they are running late yet!' },
    { name: 'Canceled', value: userStatus.canceled.length > 0 ? userStatus.canceled.map(id => `<@${id}>`).join('\n') : 'No one has canceled yet!!' }
)
.setFooter({ text: 'Event Staff Bot' });

        // Edit the original status message with the updated embed
        await statusMessage.edit({ embeds: [updatedEmbed] });

        // Acknowledge the button interaction
        await buttonInteraction.reply({ content: 'Your status has been updated!', ephemeral: true });
    } catch (error) {
        console.error('Failed to fetch the status message:', error);
        await buttonInteraction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
    }
});