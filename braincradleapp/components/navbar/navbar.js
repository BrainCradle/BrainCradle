(function() {
    'use strict';
    angular.module('braincradle.app.navbar', [])
        .directive('appHeader', function () {
            // <app-navbar></app-navbar>
            return {
                restrict: 'E',
                templateUrl: 'components/navbar/header.html'
            };
        })
        .directive('navbarStrip', function () {
            // <navbar-strip></navbar-strip>
            return {
                restrict: 'E',
                templateUrl: 'components/navbar/navbarstrip.html',
                link: link
            };
            function link(scope, element, attrs) {
                scope.active = attrs.active;
            }
        })
        .controller('HeaderController', function ($scope,AppFirebase) {
            var self = this;

            self.signin = true;

            AppFirebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    self.signin = false;
                    // User is signed in.
                    //console.log(user);
                    self.currentUser = user;

                    $scope.$apply();

                } else {
                    // No user is signed in.
                    console.log('User not logged in');
                }
            });

        })

})();
