import { CommandInteraction } from 'discord.js'
import emojiRegex from 'emoji-regex'

import { db } from '../../../utils/firebase/clients.js'

// import { db } from '../../../utils/firebase/clients.js'

const guildEmojiRegex = new RegExp(/<a?:.+?:(\d+)>/)
// Has to be returned as a function because emojiRegex is a global RegExp which has state
function discordEmojiRegex() {
  return new RegExp(guildEmojiRegex.source + '|' + emojiRegex().source, 'g')
}

export default async function setThreshold(interaction: CommandInteraction) {
  if (!interaction.guild) throw new Error('command must be run in a guild.')

  const rawEmojiString = interaction.options.getString('emoji')
  if (!rawEmojiString) throw new Error('emoji must be specified.')

  const emojiMatches = Array.from(rawEmojiString.matchAll(discordEmojiRegex()))
  if (emojiMatches.length > 1) {
    await interaction.reply({
      content: 'Your input must be a single emoji.',
      ephemeral: true,
    })
    return
  }

  const parsedEmojiString = discordEmojiRegex().exec(rawEmojiString)

  if (!parsedEmojiString) throw new Error('could not parse emoji')

  let emojiId

  try {
    // If not a unicode emoji (guild emojis will have something in the regex capture group)
    if (parsedEmojiString[1]) {
      emojiId = (await interaction.guild.emojis.fetch(parsedEmojiString[1])).id
    } else {
      emojiId = rawEmojiString
    }
  } catch (error) {
    await interaction.reply({
      content: 'The emoji must belong to this server or be a default emoji.',
      ephemeral: true,
    })
    return
  }

  await db.collection(interaction.guild.id).doc('settings').set(
    {
      emoji_id: emojiId,
    },
    { merge: true },
  )
  await interaction.reply({
    content: `The emoji has been set to ${
      parsedEmojiString[1] && emojiId
        ? await interaction.guild.emojis.fetch(emojiId)
        : rawEmojiString
    }`,
  })
}
