module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        files: [
            '../braincradleapp/lib/utils/lodash.min.js',
            '../braincradleapp/lib/jquery/jquery.min.js',
            '../braincradleapp/lib/bootstrap/js/bootstrap.min.js',
            '../braincradleapp/lib/angular/angular.min.js',
            '../braincradleapp/lib/angular/angular-mocks.js',
            '../braincradleapp/lib/angular/angular-animate.min.js',
            '../braincradleapp/lib/angular/angular-ui-router.min.js',
            '../braincradleapp/lib/angular/ui-bootstrap-tpls.min.js',
            '../braincradleapp/lib/firebase/firebase.js',
            '../braincradleapp/lib/firebase/angularfire.min.js',
            '../braincradleapp/lib/avatar/angular-avatar.min.js',
            '../braincradleapp/lib/xeditable/xeditable.min.js',
            '../braincradleapp/lib/textAngular/textAngular-sanitize.min.js',
            '../braincradleapp/lib/textAngular/textAngular.min.js',
            '../braincradleapp/*.js',
            '../braincradleapp/components/**/*.js',
            '../braincradleapp/tests/*.js'
        ]
    });
};