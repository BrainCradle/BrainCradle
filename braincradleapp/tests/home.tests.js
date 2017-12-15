describe('home', function () {

    beforeEach(module('braincradle.app'));

    var $firebaseAuth,$firebaseArray,$firebaseObject,AppFirebase,Auth,AppService,$scope;

    beforeEach(inject(function (_$rootScope_,_AppFirebase_,_Auth_,_AppService_,_$firebaseAuth_,_$firebaseArray_,_$firebaseObject_) {
        AppFirebase = _AppFirebase_;
        Auth = _Auth_;
        $firebaseAuth = _$firebaseAuth_;
        $firebaseArray = _$firebaseArray_;
        AppService = _AppService_;
        $scope = _$rootScope_;
        $firebaseObject = _$firebaseObject_;
    }));

    describe('HomeController',function(){

        var homeCtrl;
        beforeEach(inject(function($controller){ //instantiate controller using $controller service
            homeCtrl = $controller('HomeController',$firebaseObject,AppFirebase,AppService);
        }));

        // Test cases
        it('Valid test', function(){
            expect(true).toBe(true); // this test is to make sure we have Karma setup
        });

        //Logout
        it('Check for Home Page Content', function(){
            expect(homeCtrl.IsContentLoaded()).toBe(true);
        });

        // User not authenticated
        it('User not authenticated', function(){
            expect(homeCtrl.IsUserAutheticated()).toBe(false);
        });

        // Assume user is logged in
        it('User authenticated', function(){
            homeCtrl.currentUser = {};
            expect(homeCtrl.IsUserAutheticated()).toBe(true);
        });

    });
});