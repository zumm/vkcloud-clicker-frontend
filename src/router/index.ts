import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import { setupLayouts } from './layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

if (import.meta.hot) {
  handleHotUpdate(router, (routes) => {
    router.clearRoutes()
    for (const route of setupLayouts(routes)) {
      router.addRoute(route)
    }
  })
}

export default router
