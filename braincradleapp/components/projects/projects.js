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

            self.AddNew = function () {
                self.addNew = true;
                self.newpost = {}
            }

            self.Save = function () {
                var updateObj = {
                    project_title: self.newpost.project_title,
                    project_post: self.newpost.project_post,
                    author: {email:self.currentUser.email,user:self.currentUser.displayName}
                }
                console.log(updateObj);

                // Get a key for a new record.
                var newKey = firebase.database().ref().child('blogs').push().key;
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


        })

})();