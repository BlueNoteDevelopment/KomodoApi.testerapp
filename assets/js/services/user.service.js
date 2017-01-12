(function () {
  'use strict';

  angular.module('app').service('user', Service);

  Service.$inject = ['$window', '$localStorage', '$http', 'API', 'auth'];

  /**
   * [Service description]
   * @param {AngularJS core} $window
   * @param {ngStorage} $localStorage
   * @param {AngularJS core} $http
   * @param {[string]} API  [Constant string representing configured API endpoint]
   * @param {services.auth} auth  [auth.service.js]
   */
  function Service($window, $localStorage, $http, API, auth) {
    var self = this;

    self.getTokenDump = function() {
      return $http.get(API + '/auth/dump');
    };

    self.login = function(username, password) {
      $http.defaults.headers.common.Authorization = 'Basic ' + $window.btoa(username + ':' + password);
      return $http.post(API + '/auth/token');
    };

    self.logout = function() {
      delete $localStorage.token;
      $http.defaults.headers.common.Authorization = '';
    };
  }
})();