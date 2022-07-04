declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPLICATION_ID: string
      BOT_TOKEN: string
      NODE_ENV: 'development' | 'production'
      DEVELOPMENT_GUILD_ID?: string
      GOOGLE_APPLICATION_CREDENTIALS_BASE64: string
    }
  }
}

export {}
