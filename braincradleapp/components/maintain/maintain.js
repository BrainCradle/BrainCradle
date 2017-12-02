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