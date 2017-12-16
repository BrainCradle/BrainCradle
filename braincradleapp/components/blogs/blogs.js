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
                console.log(self.IsUserAutheticated())
                if(self.IsUserAutheticated()) {
                    self.comment.author = {email: self.currentUser.email, user: self.currentUser.displayName}

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