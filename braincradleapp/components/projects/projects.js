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
                console.log(updateRef)
                var updateRef = projectRef.child(self.current_post.post_id)
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


        })

})();