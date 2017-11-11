(function() {
    'use strict';
    angular.module('braincradle.app.presentations', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Blogs Main
            $stateProvider.state('presentations', {
                url: '/presentations',
                templateUrl: 'components/presentations/presentations.html?'+ticks,
                controller: 'PresentationsController',
                controllerAs: 'presentationsCtrl'
            });

        })
        .controller('PresentationsController', function ($firebaseAuth,$firebaseArray,AppFirebase) {
            var self = this;

        })

})();