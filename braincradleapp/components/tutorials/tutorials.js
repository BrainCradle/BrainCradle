(function() {
    'use strict';
    angular.module('braincradle.app.tutorials', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Blogs Main
            $stateProvider.state('tutorials', {
                url: '/tutorials',
                templateUrl: 'components/tutorials/tutorials.html?'+ticks,
                controller: 'TutorialsController',
                controllerAs: 'tutorialsCtrl'
            });

        })
        .controller('TutorialsController', function ($firebaseAuth,$firebaseArray,AppFirebase) {
            var self = this;

        })

})();