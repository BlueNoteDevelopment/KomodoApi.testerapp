(function(){
    'use strict';

    angular.module('app').run(Run);

    Run.$inject = ['$rootScope', '$http', '$location', '$localStorage'];

    /**
     * [Run description]
     * @param {[type]} $rootScope    [description]
     * @param {[type]} $http         [description]
     * @param {[type]} $location     [description]
     * @param {[type]} $localStorage [description]
     * @description Invoked once app is fully loaded
     */
    function Run($rootScope, $http, $location, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.token) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.token) {
                $location.path('/login');
            }
        });
    }
})();