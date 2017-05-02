import auth from '../utils/auth.js'

function redirectToLogin(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectToDashboard(nextState, replace) {
  if (auth.loggedIn()) {
    replace('/')
  }
}
export default {
  component: require('../components/App').default,
  childRoutes: [
    { path: '/logout',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/Logout').default)
        })
      }
    },
    { onEnter: redirectToDashboard,
      childRoutes: [
        // Unauthenticated routes
        // Redirect to dashboard if user is already logged in
        { path: '/login',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/Login').default)
            })
          }
        }
      ]
    },
    { path: '/',
      onEnter: redirectToLogin,
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
      },
      childRoutes: [
        { onEnter: redirectToLogin,
          childRoutes: [
            // Protected nested routes for the dashboard
            { path: '/pageTwo',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/PageTwo').default)
                })
              }
            },
            { path: '/pageOne',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/PageOne').default)
                })
              }
            },
            { path: '/pageThree',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../components/PageThree').default)
                })
              }
            }
          ]
        }
      ]
    }

  ]
}
