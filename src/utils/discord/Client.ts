import { Client } from 'discord.js'
import { Collection } from 'discord.js'

import type { Command } from '../../types/commands'

export default class extends Client {
  commands: Collection<string, Command> = new Collection([])
}
