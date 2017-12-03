describe('maintain', function () {

    beforeEach(module('braincradle.app'));

    var $firebaseAuth,$firebaseArray,AppFirebase,Auth,AppService,$scope;

    beforeEach(inject(function (_$rootScope_,_AppFirebase_,_Auth_,_AppService_,_$firebaseAuth_,_$firebaseArray_) {
        AppFirebase = _AppFirebase_;
        Auth = _Auth_;
        $firebaseAuth = _$firebaseAuth_;
        $firebaseArray = _$firebaseArray_;
        AppService = _AppService_;
        $scope = _$rootScope_;
    }));

    describe('CategoryController',function(){

        var categoryCtrl;
        beforeEach(inject(function($controller){ //instantiate controller using $controller service
            categoryCtrl = $controller('CategoryController',$firebaseAuth,$firebaseArray,AppFirebase,AppService);
        }));

        // Test cases
        it('Valid test', function(){
            expect(true).toBe(true); // this test is to make sure we have Karma setup
        });

        // Index page is set to true
        it('Index page is set to true', function(){
            expect(categoryCtrl.index).toBe(true);
        });

        // Add new button click
        it('Add new button click', function(){
            categoryCtrl.AddNew()
            expect(categoryCtrl.index).toBe(false);
        });

        // Edit button click
        it('Edit button click', function(){
            categoryCtrl.Edit({})
            expect(categoryCtrl.index).toBe(false);
        });

        // Cancel button click
        it('Cancel button click', function(){
            categoryCtrl.AddNew()
            categoryCtrl.Cancel()
            expect(categoryCtrl.index).toBe(true);
        });

    });
});