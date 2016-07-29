import {makeRequest as mReq} from './mrequest';

module.exports = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return
    }
    pretendRequest(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token;
        if (cb) cb(true);
        this.onChange(true)
      } else {
        if (cb) cb(false);
        this.onChange(false)
      }
    })
  },

  getToken: function () {
    return localStorage.token
  },

  logout: function (cb) {

    logOutRequest(localStorage.token, (res) => {
      if (res) {
        delete localStorage.token;
        if (cb) cb();
        this.onChange(false);
      }
    })
  },

  loggedIn: function () {
    return !!localStorage.token
  },

  onChange: function () {
  }
};

function pretendRequest(email, pass, cb) {
  var jsonData = {'usermail': email, 'password': pass};
  var parreq = {
      method: 'POST',
      params: jsonData,
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://0.0.0.0:5000/apiUser/login'
  };

  mReq(parreq)
    .then(function (datums) {
      if (datums) {
        cb({
          authenticated: true,
          token: datums.token
        })
      } else {
        cb({authenticated: false})
      }
    })
    .catch(function (err) {
      console.error('Augh, there was an error!', err.statusText);
    });
}

function logOutRequest(token, cb) {
  var parreq = {
    method: 'PUT',
    params: {},
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    url: 'http://0.0.0.0:5000/apiUser/logout'
  };

  mReq(parreq)
    .then(function (datums) {
      cb({
        authenticated: false
      })
    })
    .catch(function (err) {
      console.error('logout Augh, there was an error!', err.statusText);
    });
}
