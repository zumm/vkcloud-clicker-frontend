export const APP_TITLE = import.meta.env.VITE_APP_TITLE
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const CLICK_SESSION_MAX_SIZE = Number(import.meta.env.VITE_CLICK_SESSION_MAX_SIZE ?? 200)
export const CLICK_SESSION_MAX_DURATION = Number(import.meta.env.VITE_CLICK_SESSION_MAX_DURATION ?? 5000)
export const CLICK_SESSION_MIN_DURATION = Number(import.meta.env.VITE_CLICK_SESSION_MIN_DURATION ?? 50)

export const DEFAULT_INIT_DATA = import.meta.env.DEV
  ? import.meta.env.VITE_DEFAULT_INIT_DATA
  : undefined

export const MILESTONE_EPSILON = Number(import.meta.env.VITE_MILESTONE_EPSILON ?? 250)
export const FEED_SPEED = Number(import.meta.env.VITE_FEED_SPEED || 100)
export const RAFFLE_DATE_TEXT = import.meta.env.VITE_RAFFLE_DATE_TEXT
