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
        localStorage.setItem('token', res.token);
        localStorage.setItem('unauthorized401', false);
      }
      cb(res);
      this.onChange(res.authenticated)
    })
  },

  getToken: function () {
    return localStorage.token
  },

  logout: function () {
    var parreq = {
      method: 'PUT',
      params: {},
      url: 'apiUser/logout'
    };

    if (!localStorage.unauthorized401) {
      mReq(parreq)
      .catch(function (err) {
        console.log('logout Augh, there was an error!', err.statusText);
      });
    };
    this.onChange(false);
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
