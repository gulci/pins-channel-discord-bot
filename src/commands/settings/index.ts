import { SlashCommandBuilder } from '@discordjs/builders'
import { ChannelType } from 'discord-api-types/v9'

import type { Command } from '../../types/commands'
import {
  handleSetChannel,
  handleSetEmoji,
  handleSetThreshold,
} from './handlers/index.js'

const settingsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription("Change the bot's settings")
    .setDefaultMemberPermissions('0')
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName('set')
        .setDescription('Set various settings')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('channel')
            .setDescription('The channel messages will get posted to')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription(
                  'Choose the channel pinned messages should be posted to',
                )
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('emoji')
            .setDescription(
              'The emoji that will trigger a pin once the threshold is met',
            )
            .addStringOption((option) =>
              option
                .setName('emoji')
                .setDescription(
                  'Enter a single emoji; Must be a default or server emoji',
                )
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('threshold')
            .setDescription(
              'The number of reacts it will take to trigger a pin',
            )
            .addIntegerOption((option) =>
              option
                .setName('threshold')
                .setDescription(
                  'Enter the number of reacts it will take to trigger a pin',
                )
                .setMinValue(1)
                .setRequired(true),
            ),
        ),
    ),
  async execute(interaction) {
    if (!interaction.inGuild())
      throw new Error('Command must be run in a guild.')

    if (interaction.options.getSubcommandGroup(false)) {
      switch (interaction.options.getSubcommandGroup()) {
        case 'set': {
          switch (interaction.options.getSubcommand()) {
            case 'channel': {
              await handleSetChannel(interaction)
              break
            }
            case 'emoji': {
              await handleSetEmoji(interaction)
              break
            }
            case 'threshold': {
              await handleSetThreshold(interaction)
              break
            }
          }
          break
        }
      }
    }
  },
}

export default settingsCommand
