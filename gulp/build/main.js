(function() {
    'use strict';
    angular.module('braincradle.app', [
        'ui.router'
        ,'ui.bootstrap'
        ,'firebase'
        ,'ngAvatar'
        ,'xeditable'
        ,'braincradle.app.config'
        ,'braincradle.app.auth'
        ,'braincradle.app.navbar'
        ,'braincradle.app.menu'
        ,'braincradle.app.home'
        ,'braincradle.app.blogs'
        ,'braincradle.app.presentations'
        ,'braincradle.app.projects'
        ,'braincradle.app.solutions'
        ,'braincradle.app.tutorials'
    ])
        .service('AppFirebase',function(){

            // Initialize Firebase
            var config = {
                apiKey: "AIzaSyDaLDh5Lmmm27ZkIqc_caYsdPlZGVvD72A",
                authDomain: "braincradleai.firebaseapp.com",
                databaseURL: "https://braincradleai.firebaseio.com",
                projectId: "braincradleai",
                storageBucket: "braincradleai.appspot.com",
                messagingSenderId: "434325403197"
            };
            firebase.initializeApp(config);

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
        })
        .controller('appController', function (AppFirebase,$state,AppService) {
            var self = this;
            console.log("appController");

            //AppFirebase.auth().onAuthStateChanged(function(user) {
            //    if (user) {
            //        // User is signed in.
            //        console.log(user);
            //        AppService.currentUser=user;
            //    } else {
            //        // No user is signed in.
            //        console.log('User not logged in');
            //        $state.go('login');
            //    }
            //});

        })
        .filter('ExistsInArray', function($filter){
            return function(list, arrayFilter, element1,element2){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(arrayFilter){
                    return $filter("filter")(list, function(listItem){
                        //return arrayFilter.indexOf(listItem[element]) != -1;
                        return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) != -1)
                    });

                    //return list;
                }else{
                    return list;
                }
            };
        })
        .filter('NotExistsInArray', function($filter){
            return function(list, arrayFilter, element1,element2){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(arrayFilter){
                    return $filter("filter")(list, function(listItem){
                        //return arrayFilter.indexOf(listItem[element]) != -1;
                        return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) == -1)
                    });

                    //return list;
                }else{
                    return list;
                }
            };
        })
        .filter('IsNotNull', function($filter){
            return function(list, columnname){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(columnname){
                    return $filter("filter")(list, function(listItem){
                        //return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) != -1)
                        return listItem[columnname] != '';
                    });

                }else{
                    return list;
                }
            };
        })

})();


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
        .controller('HomeController', function ($firebaseAuth,$firebaseArray,AppFirebase) {
            var self = this;

            // Get a reference to the database service
            var database = AppFirebase.database();

            console.log(AppFirebase.auth().currentUser);

            var now = new Date();
            var ticks = now.getTime();

            //firebase.database().ref('table01/' + ticks).set({
            //    name: "Test-"+ticks,
            //    id: ticks
            //});


        })

})();

(function() {
    'use strict';
    angular.module('braincradle.app.menu', [])
        .directive('appMenu', function () {
            // <app-menu></app-menu>
            return {
                restrict: 'E',
                templateUrl: 'components/menu/menu.html',
                link: function (scope, element, attrs) {
                    $(".hamburger").click(function(event) {

                        $(".top-menu").toggleClass("top-animate");
                        $(".mid-menu").toggleClass("mid-animate");
                        $(".bottom-menu").toggleClass("bottom-animate");
                        if($("#nav-container").hasClass("menu-close")){
                            $("#nav-container" ).animate({ "left": "0px" }, "310" );
                            $("#nav-container").removeClass("menu-close");
                            $("#nav-container").addClass("menu-open");

                        }
                        else{
                            $("#nav-container").removeClass("menu-open");
                            $("#nav-container").addClass("menu-close");
                            $("#nav-container" ).animate({ "left": "-300px" }, "310" );
                        }
                        //event.stopPropagation();
                    });
                    $("body").click(function(){
                        //console.log("body click");
                        //if($("#nav-container").hasClass("menu-open")){
                        //    $("#nav-container" ).animate({ "left": "-300px" }, "310" );
                        //    $(".top-menu").toggleClass("top-animate");
                        //    $(".mid-menu").toggleClass("mid-animate");
                        //    $(".bottom-menu").toggleClass("bottom-animate");
                        //    $("#nav-container").removeClass("menu-open");
                        //    $("#nav-container").addClass("menu-close");
                        //}
                    })
                    $(".custom-drop li").click(function() {
                        console.log(this);
                        if($(this).children().length>1){

                        }
                        else{
                            $("#nav-container").removeClass("menu-open");
                            $("#nav-container").addClass("menu-close");
                            $("#nav-container" ).animate({ "left": "-300px" }, "310" );
                            $(".top-menu").toggleClass("top-animate");
                            $(".mid-menu").toggleClass("mid-animate");
                            $(".bottom-menu").toggleClass("bottom-animate");
                        }
                    });
                }
            };
        })

})();


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
        .controller('HeaderController', function () {
            var self = this;


        })

})();

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
(function() {
    'use strict';
    angular.module('braincradle.app.projects', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Blogs Main
            $stateProvider.state('projects', {
                url: '/projects',
                templateUrl: 'components/projects/projects.html?'+ticks,
                controller: 'ProjectsController',
                controllerAs: 'projectsCtrl'
            });

        })
        .controller('ProjectsController', function ($firebaseAuth,$firebaseArray,AppFirebase) {
            var self = this;

        })

})();
(function() {
    'use strict';
    angular.module('braincradle.app.solutions', [])
        .config(function ($stateProvider, $urlRouterProvider,$uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Blogs Main
            $stateProvider.state('solutions', {
                url: '/solutions',
                templateUrl: 'components/solutions/solutions.html?'+ticks,
                controller: 'SolutionsController',
                controllerAs: 'solutionsCtrl'
            });

        })
        .controller('SolutionsController', function ($firebaseAuth,$firebaseArray,AppFirebase) {
            var self = this;

        })

})();
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