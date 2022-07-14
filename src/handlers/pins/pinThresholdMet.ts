import { Message, PartialMessage } from 'discord.js'

import { isMessagePinned, setPinnedMessage } from '../../db/pins/index.js'
import { getGuildSettings } from '../../db/settings/index.js'
import { GuildSettings } from '../../types/settings.js'
import { constructPinMessageEmbed } from '../../utils/discord/messages.js'

export default async function pinThresholdMet(
  message: Message | PartialMessage,
) {
  if (message.partial) throw new Error('message is a partial')
  if (!message.guild) throw new Error('message must be in a guild')
  if (!message.guildId || (await isMessagePinned(message))) return

  const pinMessageEmbed = constructPinMessageEmbed(message)
  const pinChannel = message.guild.channels.cache.get(
    ((await getGuildSettings(message.guild.id)) as GuildSettings).pin_channel,
  )
  if (!pinChannel) throw new Error('could not fetch pin channel')
  if (!pinChannel.isText()) throw new Error('channel is not text channel')
  pinChannel.send({ embeds: [pinMessageEmbed] })

  setPinnedMessage(message)
}
