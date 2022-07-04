import { CommandInteraction } from 'discord.js'

import { db } from '../../../utils/firebase/clients.js'

export default async function setThreshold(interaction: CommandInteraction) {
  if (!interaction.guildId)
    throw new Error('This command must be run in a guild.')

  const threshold = interaction.options.getInteger('threshold')
  if (!threshold) throw new Error('A positive integer must be specified.')

  await db.collection(interaction.guildId).doc('settings').set(
    {
      pin_threshold: threshold,
    },
    { merge: true },
  )
  await interaction.reply({
    content: `The pinning threshold has been set to ${threshold} react(s).`,
    ephemeral: true,
  })
}
