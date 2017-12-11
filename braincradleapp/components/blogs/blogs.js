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

        })

})();