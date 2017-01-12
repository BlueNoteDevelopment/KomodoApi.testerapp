(function(){
  'use strict';

  var angular = require('angular');

  require('ngstorage');
  require('angular-ui-router');
  require('angular-messages');

  angular.module('app', [
    'ui.router',
    'ngMessages',
    'ngStorage'
  ]);
})();