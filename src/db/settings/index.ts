import { Snowflake } from 'discord.js'
import { DocumentData } from 'firebase-admin/firestore'

import {
  guildSettingsCache,
  guildSettingsSubscriptionsCache,
} from '../../utils/caches/index.js'
import { db } from '../../utils/firebase/clients.js'

export async function getGuildSettings(guildId: Snowflake) {
  const cachedGuildSettingsSubscription =
    guildSettingsSubscriptionsCache.get<() => void | null>(guildId)
  const cachedGuildSettings = guildSettingsCache.get<DocumentData | null>(
    guildId,
  )

  // Subscribe to updates if not already subscribed
  if (cachedGuildSettingsSubscription === undefined) {
    guildSettingsSubscriptionsCache.set(
      guildId,
      db
        .collection(guildId)
        .doc('settings')
        .onSnapshot((snapshot) => {
          guildSettingsCache.set(guildId, snapshot.data())
        }),
    )
  }

  if (cachedGuildSettings === undefined) {
    const settingsDoc = await db.collection(guildId).doc('settings').get()

    if (!settingsDoc.exists) {
      // settings have not been set for this guild. Set null to ignore until set
      guildSettingsCache.set(guildId, null)
      return
    }

    guildSettingsCache.set(guildId, settingsDoc.data())
    return settingsDoc.data()
  }

  if (cachedGuildSettings === null) return
  return cachedGuildSettings
}
