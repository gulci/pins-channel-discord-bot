import { Message, MessageEmbed, PartialMessage } from 'discord.js'

export function constructPinMessageEmbed(message: Message | PartialMessage) {
  if (message.partial) throw new Error('message is a partial')
  if (!message.guild) throw new Error('message must be in a guild')

  // Derived from: https://github.com/Rushnett/starboard/
  const messageData = {
    content:
      message.content.length < 3920
        ? message.content
        : `${message.content.substring(0, 3920)} ** [ ... ] **`,
    avatarURL: message.author.displayAvatarURL({ dynamic: true }),
    imageURL: '',
  }
  const messageLink = `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
  const channelLink =
    message.channel.isThread() && message.channel.parent
      ? `<#${message.channel.parent.id}>/<#${message.channel.id}>`
      : `<#${message.channel.id}>`
  messageData.content += `\n\n→ [original message](${messageLink}) in ${channelLink}`

  if (message.embeds.length) {
    const imgs = message.embeds
      .filter((embed) => embed.thumbnail || (embed.image && embed.image.url))
      .map((embed) => {
        if (embed.thumbnail) return embed.thumbnail.url
        if (embed.image) return embed.image.url
        return
      })

    if (
      imgs[0] &&
      message.attachments.first()?.name?.substring(0, 8) !== 'SPOILER_'
    ) {
      messageData.imageURL = imgs[0]

      // site specific gif fixes
      messageData.imageURL = messageData.imageURL.replace(
        /(^https:\/\/media.tenor.com\/.*)(AAAAD\/)(.*)(\.png|\.jpg)/,
        '$1AAAAC/$3.gif',
      )
      messageData.imageURL = messageData.imageURL.replace(
        /(^https:\/\/thumbs.gfycat.com\/.*-)(poster\.jpg)/,
        '$1size_restricted.gif',
      )
    }

    // twitch clip check
    const videoEmbed = message.embeds.filter((embed) => embed.video)[0]
    if (
      videoEmbed &&
      videoEmbed.video &&
      videoEmbed.video.url &&
      videoEmbed.thumbnail &&
      videoEmbed.video.url.includes('clips.twitch.tv')
    ) {
      messageData.content += `\n⬇️ [download clip](${videoEmbed.thumbnail.url.replace(
        '-social-preview.jpg',
        '.mp4',
      )})`
    }
  } else if (message.attachments.size) {
    const firstAttachment = message.attachments.first()
    // TODO: Figure out how to make this and surrounding code TS-friendly
    if (firstAttachment === undefined) throw new Error('this should not happen')
    let name = firstAttachment.name
    if (name?.substring(0, 8) === 'SPOILER_') name = '🚫 SPOILERS 🚫'
    else messageData.imageURL = firstAttachment.url
    messageData.content += `\n📎 [${name}](${firstAttachment.proxyURL})`
  }

  return new MessageEmbed()
    .setAuthor({
      name: message.author.username,
      iconURL: messageData.avatarURL,
      url: messageData.avatarURL,
    })
    .setDescription(messageData.content)
    .setImage(messageData.imageURL)
    .setTimestamp(message.createdTimestamp)
}
