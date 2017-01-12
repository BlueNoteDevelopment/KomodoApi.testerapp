(function(){
  'use strict';

  angular.module('app')
    .factory('authInterceptor', AuthInterceptor)
    .config(Config);

  AuthInterceptor.$inject = ['API', 'auth'];

  /**
   * [AuthInterceptor description]
   * @param {[string]} API  [Constant string representing configured API endpoint]
   * @param {[services.auth]} auth [auth.service.js]
   * @description AngularJS Interceptor to handle pre-processing and post-processing of $http requests/resposes.
   */
  function AuthInterceptor(API, auth) {
    return {
      // automatically attach Authorization header
      request: function(config) {
        var token = auth.getToken();
        if(config.url.indexOf(API) === 0 && token) {
          config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
      },

      // If a token was sent back, save it
      response: function(res) {
        if(res.config.url.indexOf(API) === 0 && res.data.token) {
          auth.saveToken(res.data.token);
        }

        return res;
      }
    };
  }

  Config.$inject = ['$httpProvider'];

  /**
   * [Config description]
   * @param {[Object]} $httpProvider [AngularJS http provider]
   */
  function Config ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }
})();