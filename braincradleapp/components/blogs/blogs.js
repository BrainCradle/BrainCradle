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