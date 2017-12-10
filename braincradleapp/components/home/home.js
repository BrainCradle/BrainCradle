(function() {
    'use strict';
    angular.module('braincradle.app.home', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Auto Scroll tot he top
            $uiViewScrollProvider.useAnchorScroll();

            // Home
            $stateProvider.state('home', {
                url: '/',
                templateUrl: 'components/home/home.html?'+ticks,
                controller: 'HomeController',
                controllerAs: 'homeCtrl'
            });

            $urlRouterProvider.otherwise('/');

        })
        .controller('HomeController', function ($firebaseObject,AppFirebase,AppService) {
            var self = this;

            // Get a reference to the database service
            var database = AppFirebase.database();

            // Get the logged in user
            console.log(AppFirebase.auth().currentUser);
            self.currentUser = AppFirebase.auth().currentUser;

            AppService.active = "home";

            var homepagecontentRef = database.ref().child("homepagecontent");

            self.homepagecontent = $firebaseObject(homepagecontentRef);

            self.IsContentLoaded = function(){
                if(self.homepagecontent){
                    return true;
                }else{
                    return false;
                }
            }


        })

})();
