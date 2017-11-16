module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        files: [
            '../braincradleapp/*.js',
            'test/**/*.spec.js'
        ]
    });
};