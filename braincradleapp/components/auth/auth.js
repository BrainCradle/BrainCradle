(function() {
    'use strict';
    angular.module('braincradle.app.auth', [])
        .config(function($stateProvider){
            var now = new Date();
            var ticks = now.getTime();

            $stateProvider.state('login', {
                url: '/login',
                controller: 'AuthController as authCtrl',
                templateUrl: 'components/auth/login.html?'+ticks,
                resolve: {
                    requireNoAuth: function($state, Auth){
                        if(Auth.currentUser == null){
                            return;
                        }else{
                            $state.go('home');
                        }
                    }
                }
            });
            $stateProvider.state('register', {
                url: '/register',
                controller: 'AuthController as authCtrl',
                templateUrl: 'components/auth/register.html?'+ticks,
                resolve: {
                    requireNoAuth: function($state, Auth){
                        if(Auth.currentUser == null){
                            return;
                        }else{
                            $state.go('home');
                        }
                    }
                }
            });
        })
        .service('Auth',function($firebaseAuth,AppFirebase,AppConfig){
            console.log("Auth");

            return AppFirebase.auth();
        })
        .controller('AuthController',function(Auth,$state,AppConfig,AppFirebase){
            var self = this;

            self.user = {
                email: '',
                password: '',
                display_name:''
            };
            //console.log(Auth);

            self.login = function(){
                Auth.signInWithEmailAndPassword(self.user.email,self.user.password).then(function (auth){
                    $state.go('home');
                }, function (error){
                    self.error = error;
                });
            }

            self.register = function(){
                Auth.createUserWithEmailAndPassword(self.user.email,self.user.password).then(function (user){

                    Auth.signInWithEmailAndPassword(self.user.email,self.user.password).then(function (auth){

                        var database = AppFirebase.database();
                        database.ref('users'+'/'+user.uid).set({
                            display_name: self.user.display_name
                        });

                        $state.go('home');
                    }, function (error){
                        self.error = error;
                    });

                    //user.updateProfile({
                    //    displayName: self.user.display_name
                    //}).then(function() {
                    //    // Update successful.
                    //    self.login();
                    //}, function(error) {
                    //    self.error = error;
                    //});
                    //self.login();
                }, function (error){
                    self.error = error;
                });
            }
        })

})();