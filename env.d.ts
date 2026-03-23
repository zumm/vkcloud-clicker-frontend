/// <reference types="vite/client" />
/// <reference types="vue-router/auto" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_CLICK_SESSION_MAX_SIZE: string
  readonly VITE_CLICK_SESSION_MAX_DURATION: string
  readonly VITE_CLICK_SESSION_MIN_DURATION: string
  readonly VITE_DEFAULT_INIT_DATA: string
  readonly VITE_MILESTONE_EPSILON: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
