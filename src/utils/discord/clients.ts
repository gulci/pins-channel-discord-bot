import { ClientOptions, Collection, Intents } from 'discord.js'
import { Client as DiscordClient } from 'discord.js'

import type { Command } from '../../types/commands'

class Client extends DiscordClient {
  commands: Collection<string, Command> = new Collection([])
}
const clientOptions: ClientOptions = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'REACTION', 'USER'],
}

if (process.env.NODE_ENV === 'production') {
  clientOptions.sweepers = {
    messages: {
      interval: 43200,
      lifetime: 21600,
    },
  }
}

export const client = new Client(clientOptions)
