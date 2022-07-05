import { Collection } from 'discord.js'
import 'dotenv/config'

import settings from './commands/settings/index.js'
// import './deploy-commands.js'
import { handleReactionAdd } from './handlers/index.js'
import { client } from './utils/discord/clients.js'

client.commands = new Collection()
client.commands.set(settings.data.name, settings)

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true,
      })
    }
  }
})

client.on('messageReactionAdd', handleReactionAdd)

client.login(process.env.BOT_TOKEN)
