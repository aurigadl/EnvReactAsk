import { browserHistory  } from 'react-router'

const makeRequest = function (opts) {

  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    var method = opts.method;
    var url    = opts.url;
    var data_send = '';
    var params = '';

    if(opts.params != null){
      params = opts.params;
    }

    if (method === 'GET') {
      if (params && typeof params === 'object') {
        data_send = Object.keys(params).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
      }
      url = url.concat('?',data_send);
    }

    xhr.open(method, url);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (localStorage.token) {
      xhr.setRequestHeader('Authorization', localStorage.token);
    }

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else if (this.status == 401) {
        localStorage.setItem('unauthorized401', true);
        browserHistory.push(`/logout`)
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
          message: JSON.parse(xhr.response)
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };


    if(method === 'GET'){
      xhr.send();
    }

    if(method === 'POST' || method === 'PUT' || method === 'DELETE'){
      xhr.send(JSON.stringify(params));
    }

  })

};

const remoteData = function (parreq, cb_success, cb_error) {
  makeRequest(parreq)
    .then(function (response) {
      cb_success(response)
    }.bind(this))
  .catch(function (err) {
    cb_error(err);
    console.log('There was an error!', err.statusText);
  });
};

export {makeRequest, remoteData}
