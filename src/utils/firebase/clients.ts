import firebaseAdmin from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const { credential } = firebaseAdmin

initializeApp({
  credential: credential.cert(
    JSON.parse(
      Buffer.from(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
        'base64',
      ).toString('ascii'),
    ),
  ),
})

export const db = getFirestore()
