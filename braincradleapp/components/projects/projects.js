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
        .controller('ProjectsController', function ($firebaseAuth,$firebaseArray,AppFirebase,AppService) {
            var self = this;

            AppService.active = "projects";

            // Get the logged in user
            console.log(AppFirebase.auth().currentUser);
            self.currentUser = AppFirebase.auth().currentUser;

            // Get a reference to the database service
            var database = AppFirebase.database();

            var projectRef = database.ref().child("projects");
            self.projects= $firebaseArray(projectRef);


            self.addNew = false;
            self.viewPost = false;
            self.editPost = false;
            self.vote = "None";
            // Variables to keep track of number of up votes/down votes
            self.upVote = 0;
            self.downVote = 0;
            self.comment = '';

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
                    //categories:self.newpost.categories,
                    author: {email:self.currentUser.email,user:self.currentUser.displayName}
                }
                console.log(updateObj);

                // Get a key for a new record.
                database.ref('projects/'+newKey).set(updateObj);

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
            self.EditPost = function () {
                self.addNew = false;
                self.editPost = true;
            }
            self.SaveChange = function () {
                var updates = {};
                var postData = {
                    post_id: self.current_post.post_id,
                    project_title : self.current_post.project_title,
                    project_post :self.current_post.project_post,
                    //"categories":self.current_post.categories,
                    author: self.current_post.author}

                updates['/projects/' + self.current_post.post_id] = postData;
                firebase.database().ref().update(updates)

                self.editPost = false;

            }

            self.changeVote = function(vote, flag){

                var projectPostRef = projectRef.child(self.current_post.post_id)
                self.vote = vote==flag?'None':flag;
                var upVoteUsers = [];
                var downVoteUsers = [];

                projectPostRef.once('value').then(function(snapshot) {
                    var post = snapshot.val();
                    var currentUser = AppFirebase.auth().currentUser.email;
                    console.log(post)
                    console.log(currentUser)

                    if(flag=="up"){
                        // delete the user from the list contains users don't like the post
                        if(downVoteUsers.includes(currentUser)){
                            downVoteUsers.splice(index,downVoteUsers.indexOf(currentUser));
                        }
                        // add user to the list contains upvote users
                        if (snapshot.hasChild("likedUsers")) {
                            upVoteUsers = post.likedUsers;
                            if(!upVoteUsers.includes(currentUser)) {
                                upVoteUsers.push(currentUser);
                            }
                        }else{
                            upVoteUsers.push(currentUser);
                        }

                        // update downvote users and upvote users to firebase
                        projectPostRef.update({ "likedUsers": upVoteUsers })
                        projectPostRef.update({ "dislikedUsers": downVoteUsers })
                        self.upVote = upVoteUsers.length;
                        self.downVote = downVoteUsers.length;
                    }

                    if(flag=="down"){
                        // delete the user from the upvote list of users
                        if(upVoteUsers.includes(currentUser)){
                            upVoteUsers.splice(index,upVoteUsers.indexOf(currentUser));
                        }
                        // add user to the list contains downvote users
                        if (snapshot.hasChild("dislikedUsers")) {
                            downVoteUsers = post.dislikedUsers;
                            if(!downVoteUsers.includes(currentUser)) {
                                downVoteUsers.push(currentUser);
                            }
                        }else{
                            downVoteUsers.push(currentUser);
                        }
                        console.log(downVoteUsers)
                        // update downvote users and upvote users to firebase
                        projectPostRef.update({ "likedUsers": upVoteUsers })
                        projectPostRef.update({ "dislikedUsers": downVoteUsers })
                        self.upVote = upVoteUsers.length;
                        self.downVote = downVoteUsers.length;
                    }
                });



            };


        })

})();