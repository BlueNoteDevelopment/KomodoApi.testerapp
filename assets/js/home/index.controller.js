var angular = require('angular');

(function () {
  'use strict';

  angular.module('app').controller('Home.IndexController', Controller);

  Controller.$inject = ['user', 'auth', '$location'];

  /**
   * [Controller description]
   * @param {services.user} user  [user.service.js]
   * @param {services.auth} auth  [auth.service.js]
   * @param {AngularJS core} $location
   */
  function Controller(user, auth, $location) {
    var self = this;

    self.logout = function() {
      user.logout();
      $location.path('/login');
    };
    self.isAuthed = function() {
      return auth.isAuthed ? auth.isAuthed() : false;
    };
  }
})();