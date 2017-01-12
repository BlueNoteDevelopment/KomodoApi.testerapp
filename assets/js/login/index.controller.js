(function () {
  'use strict';

  angular.module('app').controller('Login.IndexController', Controller);

  Controller.$inject = ['user', 'auth', '$location'];

  /**
   * [Controller description]
   * @param {services.user} user  [user.service.js]
   * @param {services.auth} auth  [auth.service.js]
   * @param {AngularJS core} $location
   */
  function Controller(user, auth, $location) {
    var self = this;

    self.login = function() {
      self.loading = true;
      user.login(self.username, self.password)
        .then(handleRequest, handleRequest);
    };
    self.logout = function() {
      user.logout();
      $http.defaults.headers.common.Authorization = '';
    };
    self.isAuthed = function() {
      return auth.isAuthed ? auth.isAuthed() : false;
    };

    function handleRequest(res) {
      var token = res.data ? res.data.token : null;
      if (token) {
        $location.path('/');
      } else {
        self.loading = !self.loading;
        self.message = 'Username or password is incorrect';
      }
    }
  }
})();
