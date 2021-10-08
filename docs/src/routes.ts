import { lazy, VFC } from 'react'
import type { LazyExoticComponent } from 'react'

interface RouteItem {
  path: string
  component: LazyExoticComponent<VFC>
}

const routes: RouteItem[] = [
  { path: '/basic', component: lazy(() => import('./demo/Basic')) },
]

export default routes
