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

            self.doSearch = function(search) {

                if (window.find && window.getSelection) {

                    document.designMode = "on";
                    var sel = window.getSelection();
                    sel.empty();
                    sel.collapse(document.body, 0);
                    while (window.find(search)) {
                        document.execCommand("HiliteColor", false, "yellow");
                        sel.collapseToEnd();
                    }
                    document.designMode = "off";

                } else if (document.body.createTextRange) {
                    var textRange = document.body.createTextRange();
                    while (textRange.findText(search)) {
                        textRange.execCommand("BackColor", false, "yellow");
                        textRange.collapse(false);
                    }
                }
            }


        })

})();
