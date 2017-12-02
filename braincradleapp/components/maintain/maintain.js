(function() {
    'use strict';
    angular.module('braincradle.app.maintain', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Maintain Category
            $stateProvider.state('category', {
                url: '/category',
                templateUrl: 'components/maintain/category.html?'+ticks,
                controller: 'CategoryController',
                controllerAs: 'categoryCtrl'
            });
            $stateProvider.state('homepage', {
                url: '/homepage',
                templateUrl: 'components/maintain/homepage.html?'+ticks,
                controller: 'HomepageController',
                controllerAs: 'homepageCtrl'
            });

        })
        .controller('CategoryController', function ($firebaseAuth,$firebaseArray,AppFirebase) {
            var self = this;

        })

})();