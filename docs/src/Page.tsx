import type { VFC } from 'react'
import { Suspense } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import routes from './routes'

const Page: VFC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/basic" />
          </Route>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default Page
