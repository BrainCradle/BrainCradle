(function() {
    'use strict';
    angular.module('braincradle.app.solutions', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Blogs Main
            $stateProvider.state('solutions', {
                url: '/solutions',
                templateUrl: 'components/solutions/solutions.html?'+ticks,
                controller: 'SolutionsController',
                controllerAs: 'solutionsCtrl'
            });

        })
        .controller('SolutionsController', function ($firebaseAuth,$firebaseArray,AppFirebase,AppService) {
            var self = this;

            AppService.active = "solutions";

        })

})();