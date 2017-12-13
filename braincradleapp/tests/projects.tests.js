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
        //it('User not authenticated', function () {
          //  expect(projectCtrl.IsUserAutheticated()).toBe(false);
        //});

        // Add new button click
        it('Add new button click', function () {
            projectCtrl.AddNew()
            expect(projectCtrl.addNew).toBe(true);
        });

        // upvote button clicked then vote is up
        it('Upvote button click', function () {
            projectCtrl.changeVote(projectCtrl.vote, 'up')
            expect(projectCtrl.vote).toBe("up");
        });

        // downvote button clicked then vote is up
        it('Downvote button click', function () {
            projectCtrl.changeVote(projectCtrl.vote, 'down')
            expect(projectCtrl.vote).toBe("down");
        });

    });
});