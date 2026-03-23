import type { RouteRecordRaw } from 'vue-router'

const LAYOUTS = {
  default: () => import('@/layouts/default.vue'),
  hud: () => import('@/layouts/hud.vue'),
} as const

export const setupLayouts = (routes: readonly RouteRecordRaw[]) => {
  for (const route of routes) {
    route.meta ??= {}
    route.meta.layout ??= 'default'

    route.meta.processed = true

    const layout = LAYOUTS[route.meta.layout]
    const page = route.component

    route.components = {
      default: layout,
    }

    // @ts-expect-error everything is under control, right?
    route.children = [{
      path: '',
      // just to suppress warning
      name: `${String(route.name)}__page`,
      component: page,
    }]
  }

  return routes
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: keyof typeof LAYOUTS
  }
}
