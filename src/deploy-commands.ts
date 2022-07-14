import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

import random from './commands/random/index.js'
import settings from './commands/settings/index.js'

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

const commands = [settings.data.toJSON(), random.data.toJSON()]

if (process.env.NODE_ENV !== 'production') {
  console.log(
    `Registering guild application commands for ${process.env.DEVELOPMENT_GUILD_ID}:`,
  )

  if (typeof process.env.DEVELOPMENT_GUILD_ID !== 'string') {
    console.log('a DEVELOPMENT_GUILD_ID must be set')
    process.exit()
  }

  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID,
        process.env.DEVELOPMENT_GUILD_ID,
      ),
      { body: commands },
    )
    .then(() =>
      console.log(
        'Successfully registered development application guild commands.',
      ),
    )
    .catch(console.error)
} else {
  console.log(
    `Registering application commands for application ${process.env.APPLICATION_ID}:`,
  )

  commands.forEach((command) => {
    rest
      .post(Routes.applicationCommands(process.env.APPLICATION_ID), {
        body: command,
      })
      .then(() =>
        console.log(
          `Successfully registered application command "${command.name}".`,
        ),
      )
      .catch(console.error)
  })
}
