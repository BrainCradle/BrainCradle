(function() {
    'use strict';
    angular.module('braincradle.app', [
        'ui.router'
        ,'ui.bootstrap'
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
        })
        .controller('appController', function (AppFirebase,$state,AppService) {
            var self = this;
            console.log("appController");

            self.controllerLoaded = true;
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
        .service('Auth',function(AppFirebase){
            console.log("Auth");

            return AppFirebase.auth();
        })
        .controller('AuthController',function(Auth,$state,AppConfig,AppFirebase){
            var self = this;

            var provider = new firebase.auth.GoogleAuthProvider();

            Auth.signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                console.log(user);
                $state.go('home');
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;

                self.error.message = errorCode + ":" + errorMessage;
            });


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

            // Get the logged in user
            console.log(AppFirebase.auth().currentUser);
            self.currentUser = AppFirebase.auth().currentUser;

            // Get a reference to the database service
            var database = AppFirebase.database();

            var blogsRef = database.ref().child("blogs");
            self.blogs = $firebaseArray(blogsRef);
            
            self.addNew = false;
            self.viewPost = false;

            self.IsUserAutheticated = function(){
                if(self.currentUser){
                    return true;
                }else{
                    return false;
                }
            }

            self.AddNew = function () {
                self.addNew = true;
                self.newpost = {}
            }
            self.Save = function () {
                var updateObj = {
                    blog_title: self.newpost.blog_title,
                    blog_post: self.newpost.blog_post,
                    author: {email:self.currentUser.email,user:self.currentUser.displayName}
                }
                console.log(updateObj);
                // Get a key for a new record.
                var newKey = firebase.database().ref().child('blogs').push().key;
                database.ref('blogs/'+newKey).set(updateObj);

                // Done
                self.newpost = {}
                self.addNew = false;
            }
            self.Cancel = function () {
                self.newpost = {}
                self.addNew = false;
            }

            self.ViewPost = function (post) {
                self.viewPost = true;
                self.current_post = post;
            }
            self.AllPosts = function () {
                self.viewPost = false;
            }

        })

})();
(function() {
    'use strict';
    angular.module('braincradle.app.common', [])
        .controller('confirmmodalController', function ($uibModalInstance, valid) {
            var self = this;

            self.valid = valid;
            self.ok = function () {
                $uibModalInstance.close();
            };

            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .directive('switch', function () {
            return {
                restrict: 'AE'
                , replace: true
                , transclude: true
                , template: function (element, attrs) {
                    var html = '';
                    html += '<span';
                    html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
                    html += attrs.ngModel ? ' ng-click="' + attrs.disabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
                    html += ' ng-class="{ checked:' + attrs.ngModel + ', disabled:' + attrs.disabled + ' }"';
                    html += '>';
                    html += '<small></small>';
                    html += '<input type="checkbox"';
                    html += attrs.id ? ' id="' + attrs.id + '"' : '';
                    html += attrs.name ? ' name="' + attrs.name + '"' : '';
                    html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
                    html += ' style="display:none" />';
                    html += '<span class="switch-text">'; /*adding new container for switch text*/
                    html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : ''; /*switch text on value set by user in directive html markup*/
                    html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' ';  /*switch text off value set by user in directive html markup*/
                    html += '</span>';
                    return html;
                }
            }
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
        .filter('percentage', ['$filter', function ($filter) {
            return function (input, decimals) {
                if(input < 0.01 && decimals ==0){
                    return $filter('number')(input * 100, 1) + '%';
                }else{
                    return $filter('number')(input * 100, decimals) + '%';
                }

            };
        }])
        .filter('shortNumber',function () {
            return function (number, fractionSize){
                if(number === null) return null;
                if(number === 0) return "0";
                if(number == NaN) return "";
                if(!number) return "";

                if(!fractionSize || fractionSize < 0)
                    fractionSize = 1;

                var abs = Math.abs(number);
                var rounder = Math.pow(10,fractionSize);
                var isNegative = number < 0;
                var key = '';
                var powers = [
                    {key: "Q", value: Math.pow(10,15)},
                    {key: "T", value: Math.pow(10,12)},
                    {key: "B", value: Math.pow(10,9)},
                    {key: "M", value: Math.pow(10,6)},
                    {key: "K", value: 1000},
                    {key: "", value: 1}
                ];

                for(var i = 0; i < powers.length; i++) {

                    var reduced = abs / powers[i].value;

                    reduced = Math.round(reduced * rounder) / rounder;

                    if(reduced >= 1){
                        abs = reduced;
                        key = powers[i].key;
                        break;
                    }
                }

                return (isNegative ? '-' : '') + abs + key;
            };
        })
        .filter('applyFilter', function($filter) {
            return function(value, filterName) {
                if(filterName === null) return value;
                if(!filterName) return value;

                // Check if we have arguments
                var filt = filterName.split(':');

                return $filter(filt[0])(value,filt[1]);
                //var fName = [].splice.call(arguments, 1, 1)[0];
                //return $filter(filterName).apply(null, value);
            };
        })
        .directive('uiFullscreen',function($document,$window){
            return {
                restrict: 'AC',
                template:'<i class="fa fa-expand fa-fw text" id="fullscreenexpand"></i><i class="fa fa-compress fa-fw text-active" id="fullscreencompress"></i>',
                link: function(scope, el, attr) {
                    el.addClass('hide');
                    $('#fullscreencompress').addClass('hide');

                    // disable on ie11
                    if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
                        el.removeClass('hide');
                    }
                    el.on('click', function(){
                        // var target;
                        // attr.target && ( target = $(attr.target)[0] );
                        // console.log(attr[0])
                        screenfull.toggle();
                    });
                    $document.on(screenfull.raw.fullscreenchange, function () {
                        console.log(screenfull.isFullscreen)
                        if(screenfull.isFullscreen){
                            //el.addClass('active');
                            $('#fullscreenexpand').addClass('hide');
                            $('#fullscreencompress').removeClass('hide');
                        }else{
                            //el.removeClass('active');
                            $('#fullscreencompress').addClass('hide');
                            $('#fullscreenexpand').removeClass('hide');
                        }
                    });

                }
            };
        })
        .service("$previousState",function ($state) {

            var history = [];

            var $previousState = {
                previous: function (state,stateParams) {
                    if(history.length > 1){
                        if(history[0].state == history[1].state){
                            return null;
                        }
                        return history[1];
                    }else{
                        return null;
                    }

                },
                record:function(){
                    //history.push({ state: $state.current.name, params: $state.params });
                    history.unshift({ state: $state.current.name, params: $state.params })
                    history = history.slice(0, 5);
                    console.log(history);
                },
                history : history
            }

            return $previousState;
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

            // Get the logged in user
            console.log(AppFirebase.auth().currentUser);
            self.currentUser = AppFirebase.auth().currentUser;

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