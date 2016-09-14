import {makeRequest as mReq} from './mrequest';

module.exports = {
  login(email, pass, pass_c, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb({authenticated:true});
      this.onChange(true);
      return
    }
    pretendRequest(email, pass, pass_c, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token;
      }
      cb(res);
      this.onChange(res.authenticated)
    })
  },

  getToken: function () {
    return localStorage.token
  },

  logout: function (cb) {
    logOutRequest((res) => {
      if (res) {
        if (cb) cb();
        this.onChange(false);
      }
      delete localStorage.token;
    });
    delete localStorage.token;
  },

  loggedIn: function () {
    return !!localStorage.token
  },

  //It will be replace in App.js
  onChange: function(){}
};

function pretendRequest(email, pass, pass_c ,cb) {
  var jsonData = {
    'email': email,
    'password': pass,
    'password_c': pass_c
  };

  var parreq = {
      method: 'POST',
      params: jsonData,
      url: 'apiUser/login'
  };

  mReq(parreq)
    .then(function (datums) {
      if (datums) {
        cb({
          authenticated: true,
          token: datums.token
        })
      }
    })
    .catch(function (err) {
      cb({authenticated: false, error: err});
      console.log('login Augh, there was an error!', err.statusText);
    });
}

function logOutRequest(cb) {
  var parreq = {
    method: 'PUT',
    params: {},
    url: 'apiUser/logout'
  };

  mReq(parreq)
    .then(function (datums) {
      cb({authenticated: false})
    })
    .catch(function (err) {
      console.log('logout Augh, there was an error!', err.statusText);
    });
}
