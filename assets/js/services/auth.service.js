(function () {
  'use strict';

  angular.module('app').service('auth', Service);

  Service.$inject = ['$window', '$localStorage'];

  /**
   * [Service description]
   * @param {AngularJS core} $window
   * @param {ngStorage} $localStorage
   * @description JWT middleware
   */
  function Service($window, $localStorage) {
    var self = this;

    self.parseJwt = function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    };

    self.saveToken = function(token) {
      $localStorage.token = token;
    };

    self.getToken = function() {
      return $localStorage.token;
    };

    self.isAuthed = function() {
      var token = self.getToken();
      if(token) {
        var params = self.parseJwt(token);
        return Math.round(new Date().getTime() / 1000) <= params.exp;
      } else {
        return false;
      }
    };
  }
})();