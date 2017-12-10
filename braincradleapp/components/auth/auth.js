
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
        .service('Auth',function(AppFirebase){
            console.log("Auth");

            return AppFirebase.auth();
        })
        .controller('AuthController',function($scope,Auth,$state,AppConfig,AppFirebase){
            var self = this;

            var provider = new firebase.auth.GoogleAuthProvider();

            self.googleLogin = function() {
                Auth.signInWithPopup(provider).then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    console.log(user);
                    $state.go('home');
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;

                    self.error.message = errorCode + ":" + errorMessage;
                });
            }

            var providerFB = new firebase.auth.FacebookAuthProvider();
            self.facebookLogin = function() {
                console.log("using functions")
                Auth.signInWithPopup(providerFB).then(function(result) {
                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    // ...
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                    self.error.message = errorCode + ":" + errorMessage;
                });

            }

            self.register = function() {
                console.log(self.user.email)
                var result = Auth.createUserWithEmailAndPassword(self.user.email, self.user.password)
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // ..
                        self.error.message = errorCode + ":" + errorMessage;
                    });
                result.then(function(userData){
                    console.log("User Successfully created with email: ", userData.email)
                }, function(error) {
                    console.log("an error occurred ", self.error.message)
                })
            }

            self.login = function () {

                var result = Auth.signInWithEmailAndPassword(self.user.email, self.user.password).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    self.error.message = errorCode + ":" + errorMessage;
                });;
                result.then(function(authData){
                    console.log("User Successfully logged in with uid: ", authData.uid)
                }, function(error) {
                    console.log("Authentication Failed: ", self.error.message)
                })
            }

        })
})();

window.fbAsyncInit = function () {
    FB.init({
        appId: '130858520918634',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.11'
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

