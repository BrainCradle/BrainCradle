(function() {
    'use strict';
    angular.module('braincradle.app.blogs', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Blogs Main
            $stateProvider.state('blogs', {
                url: '/blogs',
                templateUrl: 'components/blogs/blogs.html?'+ticks,
                controller: 'BlogsController',
                controllerAs: 'blogsCtrl'
            });

        })
        .controller('BlogsController', function ($firebaseAuth,$firebaseArray,AppFirebase) {
            var self = this;

        })

})();