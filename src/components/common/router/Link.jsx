import React from 'react'
import { Route } from 'react-router-dom'
import { matchPath } from 'react-router'

const NavLink = function ({ component: Component, path, route, ...props }) {
  return (
    /*<Route children={globalRoute => {
      const href = link(globalRoute, route, params);
      return (
        <Route
          path={href}
          children={({ match }) => {
            const isActive = !!match
            return (
              <Component {...props} isActive={isActive} link={href} />
            )
          }}
        />
      )
    }} />*/

    <Route>
      {({ match, location }) => {
        const parentPath = match.url.substr(-1) === "/" ? match.url.substr(0,-1) : match.url;
        const absolutePath = parentPath + path;
        const _match = matchPath(location.pathname, {
          path: absolutePath,
          exact: false,
          strict: false
        })

        const isActive = !!_match;
        return (
          <Component {...props} isActive={isActive} link={absolutePath} />
        )
      }}
    </Route>
  )
}

// function link(globalRoute, route, params) {
//   const globalParams = globalRoute.match.params;

//   return route.path.split('/').map(path => {
//     if (path[0] === ':') {
//       const paramName = path.slice(1);
//       return params[paramName] || globalParams[paramName];
//     }

//     return path;
//   }).join('/');
// }

export default NavLink;
