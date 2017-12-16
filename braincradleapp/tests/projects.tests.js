describe('projects', function () {

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

    describe('ProjectsController',function() {

        var projectCtrl;
        beforeEach(inject(function ($controller) { //instantiate controller using $controller service
            projectCtrl = $controller('ProjectsController', $firebaseAuth, $firebaseArray, AppFirebase, AppService);
        }));

        // Test cases
        it('Valid test', function () {
            expect("1").toBe('1'); // this test is to make sure we have Karma setup
        });

        // Add new flag is set to false
        it('Add new flag is set to false', function () {
            expect(projectCtrl.addNew).toBe(false);
        });

        // Add new flag is set to false
        it('View post flag is set to false', function () {
            expect(projectCtrl.viewPost).toBe(false);
        });

        // User not authenticated
        it('User not authenticated', function () {
           expect(projectCtrl.IsUserAutheticated()).toBe(false);
        });

        // Add new click
        it('Add new', function () {
            projectCtrl.AddNew()
            expect(projectCtrl.addNew).toBe(true);
        });

        // Assume user is logged in
        it('User authenticated', function(){
            projectCtrl.currentUser = {};
            expect(projectCtrl.IsUserAutheticated()).toBe(true);
        });

        // Cancel
        it('Cancel check addnew', function(){
            projectCtrl.Cancel();
            expect(projectCtrl.addNew).toBe(false);
        });
        it('Cancel check editPost', function(){
            projectCtrl.Cancel();
            expect(projectCtrl.editPost).toBe(false);
        });

        it('Edit blog', function(){
            projectCtrl.EditPost();
            expect(projectCtrl.editPost).toBe(true);
        });

        it('Filter Content', function(){
            projectCtrl.FilterContent('Artificial intelligence');
            expect(projectCtrl.search).toBe('Artificial intelligence');
        });

        // Filter
        it('Filter None', function(){
            projectCtrl.FilterContent('All');
            expect(projectCtrl.search).toBe('');
        });

    });
});