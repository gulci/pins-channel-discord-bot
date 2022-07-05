import { Message, PartialMessage } from 'discord.js'
import { FieldValue } from 'firebase-admin/firestore'

import { pinnedMessageIdsCache } from '../../utils/caches/index.js'
import { db } from '../../utils/firebase/clients.js'

export async function isMessagePinned(message: Message | PartialMessage) {
  if (!message.guildId) throw new Error('guild id not found')

  const cachedPinnedMessageId = pinnedMessageIdsCache.get<boolean | null>(
    message.id,
  )

  if (cachedPinnedMessageId === undefined) {
    const pinnedMessageDoc = await db
      .collection(message.guildId)
      .doc('data')
      .collection('pinned_messages')
      .doc(message.id)
      .get()
    if (!pinnedMessageDoc.exists) return false
    pinnedMessageIdsCache.set<boolean>(message.id, true)
  }

  return true
}

export async function setPinnedMessage(message: Message) {
  if (!message.guildId) throw new Error('guild id not found')

  const pinnedMessageDoc = db
    .collection(message.guildId)
    .doc('data')
    .collection('pinned_messages')
    .doc(message.id)
  await pinnedMessageDoc.set({ pinned_at: FieldValue.serverTimestamp() })
}
