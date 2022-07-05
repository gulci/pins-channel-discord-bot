import NodeCache from 'node-cache'

export const guildSettingsCache = new NodeCache({ stdTTL: 60 * 60 * 12 })

export const guildSettingsSubscriptionsCache = new NodeCache({
  stdTTL: 60 * 60,
}).on('expired', (_, detachSubscription: () => void) => {
  detachSubscription()
})

export const pinnedMessageIdsCache = new NodeCache({ stdTTL: 60 * 60 * 12 })
