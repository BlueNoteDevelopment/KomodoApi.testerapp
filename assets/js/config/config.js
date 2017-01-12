(function(){
  'use strict';

  angular.module('app').config(Config);

  Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  /**
   * [Config description]
   * @param {[type]} $stateProvider     [description]
   * @param {[type]} $urlRouterProvider [description]
   * @param {[type]} $locationProvider  [description]
   * @description Invoked before app loads
   */
  function Config($stateProvider, $urlRouterProvider, $locationProvider) {
    // default route
    $urlRouterProvider.otherwise("/");

    // app routes
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'assets/js/home/index.view.html',
            controller: 'Home.IndexController',
            controllerAs: 'vm'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'assets/js/login/index.view.html',
            controller: 'Login.IndexController',
            controllerAs: 'vm'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }
})();