import { CommandInteraction } from 'discord.js'

import { db } from '../../../utils/firebase/clients.js'

export default async function setChannel(interaction: CommandInteraction) {
  if (!interaction.guildId)
    throw new Error('This command must be run in a guild.')

  const channel = interaction.options.getChannel('channel')
  if (!channel) throw new Error('A channel must be specified.')

  await db.collection(interaction.guildId).doc('settings').set(
    {
      pin_channel: channel.id,
    },
    { merge: true },
  )
  await interaction.reply({
    content: `The pins channel has been set to <#${channel.id}>.`,
    ephemeral: true,
  })
}
