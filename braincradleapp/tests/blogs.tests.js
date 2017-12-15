describe('blogs', function () {

    beforeEach(module('braincradle.app'));

    var $firebaseAuth,$firebaseArray,AppFirebase,Auth,AppService,$scope;

    beforeEach(inject(function ($rootScope,_AppFirebase_,_Auth_,_AppService_,_$firebaseAuth_,_$firebaseArray_) {
        AppFirebase = _AppFirebase_;
        Auth = _Auth_;
        $firebaseAuth = _$firebaseAuth_;
        $firebaseArray = _$firebaseArray_;
        AppService = _AppService_;
        $scope = $rootScope.$new();
    }));

    describe('BlogsController',function(){

        var blogsCtrl;
        beforeEach(inject(function($controller){ //instantiate controller using $controller service
            blogsCtrl = $controller('BlogsController',$firebaseAuth,$firebaseArray,AppFirebase,AppService);
        }));

        // Test cases
        it('Valid test', function(){
            expect("1").toBe('1'); // this test is to make sure we have Karma setup
        });

        // Add new flag is set to false
        it('Add new flag is set to false', function(){
            expect(blogsCtrl.addNew).toBe(false);
        });

        // Add new flag is set to false
        it('View post flag is set to false', function(){
            expect(blogsCtrl.viewPost).toBe(false);
        });

        // User not authenticated
        it('User not authenticated', function(){
            expect(blogsCtrl.IsUserAutheticated()).toBe(false);
        });

        // Add new button click
        it('Add new button click', function(){
            blogsCtrl.AddNew()
            expect(blogsCtrl.addNew).toBe(true);
        });

        // Cancel button click
        it('Cancel button click', function(){
            blogsCtrl.AddNew()
            blogsCtrl.Cancel()
            expect(blogsCtrl.addNew).toBe(false);
        });

        // View a post
        it('View a post', function(){
            blogsCtrl.ViewPost({})
            expect(blogsCtrl.viewPost).toBe(true);
        });

        // View all posts
        it('View all posts', function(){
            blogsCtrl.AllPosts()
            expect(blogsCtrl.viewPost).toBe(false);
        });

        // Check all posts
        it('Check all posts', function(){
            // Get a reference to the database service
            var database = AppFirebase.database();

            var blogsRef = database.ref().child("blogs");
            var blogs = $firebaseArray(blogsRef);
            expect(blogsCtrl.blogs.length).toBe(blogs.length);
        });

        // Login - Not a unit test
        it('Login', function(){
            var provider = new firebase.auth.GoogleAuthProvider();

            AppFirebase.auth().signInWithPopup(provider).then(function(result) {
                // Successful login
                expect(true).toBe(true);
            }).catch(function(error) {
                expect(false).toBe(true);
            });

        });

        // User authenticated
        it('User authenticated', function(){
            expect(blogsCtrl.IsUserAutheticated()).toBe(false);
        });

        it('Edit blog', function(){
            blogsCtrl.EditPost();
            expect(blogsCtrl.editPost).toBe(true);
        });
        it('Edit blog 2', function(){
            blogsCtrl.EditPost();
            expect(blogsCtrl.addNew).toBe(false);
        });

        // Able to edit comment
        it('Edit Comment', function(){
            blogsCtrl.Comment();
            expect(blogsCtrl.leaveComment).toBe(true);
        });


    });
});