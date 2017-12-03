describe('navbar', function () {

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

    describe('HeaderController',function(){

        var headCtrl;
        beforeEach(inject(function($controller){ //instantiate controller using $controller service
            headCtrl = $controller('HeaderController',AppFirebase);
        }));

        // Test cases
        it('Valid test', function(){
            expect(true).toBe(true); // this test is to make sure we have Karma setup
        });

        //Logout
        it('Log Out', function(){
            headCtrl.signOut();
            expect(headCtrl.IsUserAutheticated()).toBe(false);
        });

        // Facebook login
        it('Login Facebook', function(){
            var provider = new firebase.auth.FacebookAuthProvider();

            AppFirebase.auth().signInWithPopup(provider).then(function(result) {
                // Successful login
                expect(true).toBe(true);
            }).catch(function(error) {
                expect(false).toBe(true);
            });
        });

    });
});