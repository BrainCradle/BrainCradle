(function() {
    'use strict';
    angular.module('braincradle.app.config', [])
        .service('AppConfig', function () {
            this.Settings = {
                app_version: 1.0,
                app_id: "braincradle",
                databaseURL: "https://braincradleai.firebaseio.com"
            };
        });

})();
