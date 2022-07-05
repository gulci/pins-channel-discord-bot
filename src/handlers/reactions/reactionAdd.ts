import { MessageReaction, PartialMessageReaction } from 'discord.js'

import { getGuildSettings } from '../../db/settings/index.js'
import { GuildSettings } from '../../types/settings.js'
import { handlePinThresholdMet } from '../index.js'

export default async function reactionAdd(
  reaction: MessageReaction | PartialMessageReaction,
) {
  if (reaction.partial) {
    try {
      await reaction.fetch()
    } catch (error) {
      console.error('something went wrong when fetching the reaction:', error)
      return
    }
  }

  if (!reaction.message.guildId) return
  const settings = (await getGuildSettings(
    reaction.message.guildId,
  )) as GuildSettings

  if (
    reaction.count === null ||
    reaction.message.channelId === settings.pin_channel ||
    (reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name) !==
      settings.emoji_id
  )
    return

  if (reaction.count >= settings.pin_threshold) {
    handlePinThresholdMet(reaction.message)
  }
}
