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
        .controller('BlogsController', function ($firebaseAuth,$firebaseArray,AppFirebase,AppService) {
            var self = this;

            // Get the logged in user
            console.log(AppFirebase.auth().currentUser);
            self.currentUser = AppFirebase.auth().currentUser;

            // Get a reference to the database service
            var database = AppFirebase.database();

            var blogsRef = database.ref().child("blogs");
            self.blogs = $firebaseArray(blogsRef);

            var categoriesRef = database.ref().child("categories");
            self.categories = $firebaseArray(categoriesRef);

            AppService.active = "blogs";

            self.addNew = false;
            self.viewPost = false;
            self.editPost = false;
            self.leaveComment = false;
            self.hasComment = false;
            self.comment = '';
            self.search = '';

            self.IsUserAutheticated = function(){
                if(self.currentUser){
                    return true;
                }else{
                    return false;
                }
            }

            self.AddNew = function () {
                self.addNew = true;
                self.editPost = false;
                self.newpost = {}
            }
            self.FindCategory = function (id) {
                var cat = _.find(self.categories, function(o) { return o.$id == id; });
                return cat.category_name;
            }

            self.Save = function () {
                var newKey = firebase.database().ref().child('blogs').push().key;

                var updateObj = {
                    post_id:newKey,
                    blog_title: self.newpost.blog_title,
                    blog_post: self.newpost.blog_post,
                    //categories:self.newpost.categories,
                    author: {email:self.currentUser.email,user:self.currentUser.displayName}
                }
                console.log(updateObj);

                // Get a key for a new record.
                database.ref('blogs/'+newKey).set(updateObj);

                // Done
                self.newpost = {}
                self.addNew = false;
            }

            self.Cancel = function () {
                self.newpost = {}
                self.addNew = false;
                self.editPost = false;
            }

            self.ViewPost = function (post) {
                console.log(post);
                self.viewPost = true;
                self.editPost = false;
                self.current_post = post;
                self.ifComment()
                console.log(self.hasComment)
            }
            self.AllPosts = function () {
                self.viewPost = false;
                self.editPost = false;
            }

            self.EditPost = function () {
                self.addNew = false;
                self.editPost = true;
            }
            self.SaveChange = function () {
                var updateRef = blogsRef.child(self.current_post.post_id)
                var updates = {};
                var postData = {
                    "post_id": self.current_post.post_id,
                    "blog_title": self.current_post.blog_title,
                    "blog_post" :self.current_post.blog_post,
                    "categories":self.current_post.categories,
                    "author": self.current_post.author,
                    comment: self.comment}

                updates['/blogs/' + self.current_post.post_id] = postData;
                firebase.database().ref().update(updates)

                self.editPost = false;

            }
            self.Comment = function () {
                self.leaveComment = true;
                self.comment = {}

            }

            self.SaveComment = function () {

                if(self.IsUserAutheticated()) {
                    self.comment.author = {email: self.currentUser.email, user: self.currentUser.displayName}
                    console.log(self.comment)
                    var postData = {
                        "post_id": self.current_post.post_id,
                        "blog_title": self.current_post.blog_title,
                        "blog_post" :self.current_post.blog_post,
                        "categories":self.current_post.categories,
                        "author": self.current_post.author,
                        comment: self.comment
                    }
                    var updates = {};
                    updates['/blogs/' + self.current_post.post_id] = postData;
                    firebase.database().ref().update(updates)
                    self.comment = {}
                    self.leaveComment = false;
                    self.current_post.hasComment = true;
                }else{

                    console.log("Access denied, login first")
                }

            }

            // to check if the current post has any comments
            self.ifComment = function () {
                console.log("ifComment")
                if(self.current_post.post_id != null) {
                    var currentBlog = firebase.database().ref().child('blogs').child(self.current_post.post_id)
                    console.log(currentBlog)
                    currentBlog.child("comment").once("value").then(function (snapshot) {
                            if (snapshot.val()) {
                                console.log(snapshot.val())
                                self.current_post.hasComment = true;
                            }
                        }
                    )
                }
            }


            self.changeVote = function (vote, flag) {

                var blogsPostRef = blogsRef.child(self.current_post.post_id)
                self.vote = vote == flag ? 'None' : flag;


                blogsPostRef.once('value').then(function (snapshot) {
                    var post = snapshot.val();
                    var currentUser = AppFirebase.auth().currentUser.email;


                    if (snapshot.hasChild("likedUsers")) {
                            var upVoteUsers = post.likedUsers;
                    } else {
                        var upVoteUsers = [];
                    }

                    if (snapshot.hasChild("dislikedUsers")) {
                        var downVoteUsers = post.dislikedUsers;
                    } else {
                        var downVoteUsers = [];
                    }

                    if (flag == "up") {
                        // delete the user from the list contains users don't like the post
                        if (downVoteUsers.includes(currentUser)) {
                            var newArray = [];
                            downVoteUsers.forEach(function (p) {
                                if (p != currentUser) {
                                    newArray.push(p);
                                }
                                downVoteUsers = newArray
                            });
                        }
                        // add user to the list contains upvote users if not already exists
                        if (!upVoteUsers.includes(currentUser)) {
                            upVoteUsers.push(currentUser);
                        }
                        // update downvote users and upvote users to firebase
                        blogsPostRef.update({"likedUsers": upVoteUsers})
                        blogsPostRef.update({"dislikedUsers": downVoteUsers})
                        self.upVote = upVoteUsers.length;
                        self.downVote = downVoteUsers.length;
                    }

                    if (flag == "down") {
                        // delete the user from the upvote list of users
                        if (upVoteUsers.includes(currentUser)) {
                            var newArray = [];
                            upVoteUsers.forEach(function (p) {
                                if (p != currentUser) {
                                    newArray.push(p);
                                }
                                upVoteUsers = newArray
                            });
                        }
                        // add user to the list contains downvote users if not already exists
                        if (!downVoteUsers.includes(currentUser)) {
                            downVoteUsers.push(currentUser);
                        }

                        // update downvote users and upvote users to firebase
                        blogsPostRef.update({"likedUsers": upVoteUsers})
                        blogsPostRef.update({"dislikedUsers": downVoteUsers})
                        self.upVote = upVoteUsers.length;
                        self.downVote = downVoteUsers.length;
                    }
                });

        };

            self.FilterContent = function (txt) {
                console.log(txt)
                if(txt == 'All'){
                    txt = '';
                }
                self.search = txt;
            }
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

            self.IsUserAutheticated = function(){
                if(self.currentUser){
                    return true;
                }else{
                    return false;
                }
            }

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
                controller: 'HomePageController',
                controllerAs: 'homePageContentCtrl'
            });

        })
        .controller('CategoryController', function ($firebaseAuth,$firebaseArray,AppFirebase,AppService) {
            var self = this;

            AppService.active = "none";

            // Get a reference to the database service
            var database = AppFirebase.database();

            var categoriesRef = database.ref().child("categories");
            self.categories = $firebaseArray(categoriesRef);

            console.log(self.categories);

            self.index = true;
            self.$id = '';
            self.category_name = '';

            self.AddNew = function(){
                self.index = false;
                self.$id = '';
                self.category_name = '';
            }
            self.Edit = function(row){
                self.index = false;
                self.$id = row.$id;
                self.category_name = row.category_name;
            }
            self.Delete = function(message){


            }
            self.Cancel = function(){
                self.index = true;
            }
            self.Save = function(){
                console.log("Save....");
                var updateObj = {
                    category_name: self.category_name
                }

                if(self.$id ==''){
                    // Get a key for a new record.
                    var newKey = firebase.database().ref().child('categories').push().key;

                    database.ref('categories/'+newKey).set(updateObj);
                }else{
                    database.ref('categories/'+self.$id).set(updateObj);
                }

                self.$id = '';
                self.category_name = '';
                self.index = true;
            }
        })
        .controller('HomePageController', function ($firebaseAuth,$firebaseObject,AppFirebase,AppService) {
            var self = this;

            AppService.active = "none";

            // Get a reference to the database service
            var database = AppFirebase.database();

            var homepagecontentRef = database.ref().child("homepagecontent");

            self.homepagecontent = $firebaseObject(homepagecontentRef);


            self.homepagecontent.$loaded()
                .then(function(data) {
                    console.log(data);
                    if(!self.homepagecontent.content1){
                        self.homepagecontent.content1 = '<p>Home page content here...</p>';
                    }
                })
                .catch(function(error) {
                    console.error("Error:", error);
                });

            self.Save = function(){
                self.homepagecontent.$save().then(function(ref) {
                    console.log(ref);
                }, function(error) {
                    console.log("Error:", error);
                });
            }

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
        .controller('HeaderController', function (AppFirebase) {
            var self = this;

            self.signin = true;

            AppFirebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    self.signin = false;
                    // User is signed in.
                    //console.log(user);
                    self.currentUser = user;

                    //$scope.$apply();

                } else {
                    // No user is signed in.
                    console.log('User not logged in');
                }
            });
            self.signOut = function () {
                console.log("clicked")
                firebase.auth().signOut().then(function () {
                    // Sign-out successful.
                }).catch(function (error) {
                    // An error happened.
                });

            }

            self.IsUserAutheticated = function(){
                if(self.currentUser){
                    return true;
                }else{
                    return false;
                }
            }

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
(function () {
    'use strict';
    angular.module('braincradle.app.projects', [])
        .config(function ($stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // Blogs Main
            $stateProvider.state('projects', {
                url: '/projects',
                templateUrl: 'components/projects/projects.html?' + ticks,
                controller: 'ProjectsController',
                controllerAs: 'projectsCtrl'
            });

        })
        .controller('ProjectsController', function ($firebaseAuth, $firebaseArray, AppFirebase, AppService) {
            var self = this;

            AppService.active = "projects";

            // Get the logged in user
            self.currentUser = AppFirebase.auth().currentUser;

            // Get a reference to the database service
            var database = AppFirebase.database();

            var projectRef = database.ref().child("projects");
            self.projects = $firebaseArray(projectRef);

            var categoriesRef = database.ref().child("categories");
            self.categories = $firebaseArray(categoriesRef);


            self.addNew = false;
            self.viewPost = false;
            self.editPost = false;
            self.vote = "None";
            self.search = '';

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
                var newKey = firebase.database().ref().child('blogs').push().key;

                var updateObj = {
                    post_id: newKey,
                    project_title: self.newpost.project_title,
                    project_post: self.newpost.project_post,
                    categories:self.newpost.categories,
                    author: {email: self.currentUser.email, user: self.currentUser.displayName}
                }

                // Get a key for a new record.
                database.ref('projects/' + newKey).set(updateObj);

                // Done
                self.newpost = {}
                self.addNew = false;
            }

            self.Cancel = function () {
                self.newpost = {}
                self.addNew = false;
                self.editPost = false;
            }

            self.ViewPost = function (post) {
                self.viewPost = true;
                self.current_post = post;
                // Variables to keep track of number of up votes/down votes
                var projectPostRef = projectRef.child(self.current_post.post_id)
                self.upVoteUsers = [];
                self.downVoteUsers = [];
                projectPostRef.once('value').then(function (snapshot) {
                    var post = snapshot.val();
                    var currentUser = AppFirebase.auth().currentUser.email;
                    if (snapshot.hasChild("likedUsers")) {
                        self.upVoteUsers = post.likedUsers;
                        self.upVote = self.upVoteUsers.length;
                    }
                    if (snapshot.hasChild("dislikedUsers")) {
                        self.downVoteUsers = post.dislikedUsers;
                        self.downVote = self.downVoteUsers.length;
                    }
                });
                self.comment = '';
            }

            self.AllPosts = function () {
                self.viewPost = false;
            }
            self.EditPost = function () {
                self.addNew = false;
                self.editPost = true;
            }
            self.SaveChange = function () {
                var updates = {};
                var postData = {
                    post_id: self.current_post.post_id,
                    project_title: self.current_post.project_title,
                    project_post: self.current_post.project_post,
                    categories:self.current_post.categories,
                    author: self.current_post.author
                }

                updates['/projects/' + self.current_post.post_id] = postData;
                firebase.database().ref().update(updates)

                self.editPost = false;

            }

            self.changeVote = function (vote, flag) {

                var projectPostRef = projectRef.child(self.current_post.post_id)
                self.vote = vote == flag ? 'None' : flag;


                projectPostRef.once('value').then(function (snapshot) {
                    var post = snapshot.val();
                    var currentUser = AppFirebase.auth().currentUser.email;


                    if (snapshot.hasChild("likedUsers")) {
                        var upVoteUsers = post.likedUsers;
                    } else {
                        var upVoteUsers = [];
                    }

                    if (snapshot.hasChild("dislikedUsers")) {
                        var downVoteUsers = post.dislikedUsers;
                    } else {
                        var downVoteUsers = [];
                    }

                    if (flag == "up") {
                        // delete the user from the list contains users don't like the post
                        if (downVoteUsers.includes(currentUser)) {
                            var newArray = [];
                            downVoteUsers.forEach(function (p) {
                                if (p != currentUser) {
                                    newArray.push(p);
                                }
                                downVoteUsers = newArray
                            });
                        }
                        // add user to the list contains upvote users if not already exists
                        if (!upVoteUsers.includes(currentUser)) {
                            upVoteUsers.push(currentUser);
                        }
                        // update downvote users and upvote users to firebase
                        projectPostRef.update({"likedUsers": upVoteUsers})
                        projectPostRef.update({"dislikedUsers": downVoteUsers})
                        self.upVote = upVoteUsers.length;
                        self.downVote = downVoteUsers.length;
                    }

                    if (flag == "down") {
                        // delete the user from the upvote list of users
                        if (upVoteUsers.includes(currentUser)) {
                            var newArray = [];
                            upVoteUsers.forEach(function (p) {
                                if (p != currentUser) {
                                    newArray.push(p);
                                }
                                upVoteUsers = newArray
                            });
                        }
                        // add user to the list contains downvote users if not already exists
                        if (!downVoteUsers.includes(currentUser)) {
                            downVoteUsers.push(currentUser);
                        }

                        // update downvote users and upvote users to firebase
                        projectPostRef.update({"likedUsers": upVoteUsers})
                        projectPostRef.update({"dislikedUsers": downVoteUsers})
                        self.upVote = upVoteUsers.length;
                        self.downVote = downVoteUsers.length;
                    }
                });


            };

            self.FilterContent = function (txt) {
                console.log(txt)
                if(txt == 'All'){
                    txt = '';
                }
                self.search = txt;
            }

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
        .controller('SolutionsController', function ($firebaseAuth,$firebaseArray,AppFirebase,AppService) {
            var self = this;

            AppService.active = "solutions";

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