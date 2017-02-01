import auth from '../utils/auth.js'

function redirectToLogin(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

export default {
  component: require('../components/App').default,
  childRoutes: [
    {
      path: '/logout',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/Login').default)
        })
      }
    },
    {
      path: '/',
      getComponent: (nextState, cb) => {
        // Share the path
        // Dynamically load the correct component
        if (auth.loggedIn()) {
          return require.ensure([], (require) => {
            cb(null, require('../components/PageTwo').default)
          })
        }
        return require.ensure([], (require) => {
          cb(null, require('../components/Login').default)
        })
      }
    },

    {
      path: '/pageTwo',
      getComponent: (nextState, cb) => {
        // Share the path
        // Dynamically load the correct component
        if (auth.loggedIn()) {
          return require.ensure([], (require) => {
            cb(null, require('../components/PageTwo').default)
          })
        }
        return require.ensure([], (require) => {
          cb(null, require('../components/Login').default)
        })
      }
    },

    {
      path: '/PageOne',

      getComponent: (nextState, cb) => {
        // Share the path
        // Dynamically load the correct component
        if (auth.loggedIn()) {
          return require.ensure([], (require) => {
            cb(null, require('../components/PageOne').default)
          })
        }
        return require.ensure([], (require) => {
          cb(null, require('../components/Login').default)
        })
      },

      indexRoute: {
        getComponent: (nextState, cb) => {
          // Only load if we're logged in
          if (auth.loggedIn()) {
            return require.ensure([], (require) => {
              cb(null, require('../components/PageTwo').default)
            })
          }
          return cb()
        }
      }

    }

  ]
}
