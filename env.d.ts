/// <reference types="vite/client" />
/// <reference types="vue-router/auto" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_CLICK_SESSION_MAX_SIZE?: string
  readonly VITE_CLICK_SESSION_MAX_DURATION?: string
  readonly VITE_CLICK_SESSION_MIN_DURATION?: string
  readonly VITE_DEFAULT_INIT_DATA?: string
  readonly VITE_MILESTONE_EPSILON?: string
  readonly VITE_FEED_SPEED?: string
  readonly VITE_RAFFLE_DATE_TEXT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
