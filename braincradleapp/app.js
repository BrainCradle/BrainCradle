(function() {
    'use strict';
    angular.module('braincradle.app', [
        'ui.router'
        ,'ui.bootstrap'
        ,'ui.select'
        ,'firebase'
        ,'textAngular'
        ,'ngAvatar'
        ,'xeditable'
        ,'braincradle.app.config'
        ,'braincradle.app.auth'
        ,'braincradle.app.navbar'
        ,'braincradle.app.menu'
        ,'braincradle.app.common'
        ,'braincradle.app.home'
        ,'braincradle.app.blogs'
        ,'braincradle.app.presentations'
        ,'braincradle.app.projects'
        ,'braincradle.app.solutions'
        ,'braincradle.app.tutorials'
        ,'braincradle.app.maintain'
    ])
        .service('AppFirebase',function(){
            var self = this;
            // Initialize Firebase
            self.config = {
                apiKey: "AIzaSyDaLDh5Lmmm27ZkIqc_caYsdPlZGVvD72A",
                authDomain: "braincradleai.firebaseapp.com",
                databaseURL: "https://braincradleai.firebaseio.com",
                projectId: "braincradleai",
                storageBucket: "braincradleai.appspot.com",
                messagingSenderId: "434325403197"
            };
            if (!firebase.apps.length) {
                firebase.initializeApp(self.config);
            }

            return firebase;
        })
        .provider('App',function(){
            var text = null;

            this.setText = function (textString) {
                text = textString;
            };

            this.$get = [function () {
                return text;
            }];
        })
        .service('AppService',function($q,$state, AppFirebase){
            var self = this;

            self.FirebaseCurrentUser = {};
            self.ResolveFirebaseCurrentUser = function(){
                var deferred = $q.defer();

                AppFirebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        // User is signed in.
                        console.log(user);
                        deferred.resolve(user);
                    } else {
                        // No user is signed in.
                        console.log('User not logged in');
                        $state.go('login');
                    }
                });

                return deferred.promise;
            }
            self.active = "home";
        })
        .controller('appController', function (AppFirebase,$state,AppService) {
            var self = this;
            console.log("appController");

            self.AppService = AppService;

            self.controllerLoaded = true;
        })
})();

