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


        })

})();