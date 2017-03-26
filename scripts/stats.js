var _ = require('lodash');
var values = require('./test.json');
var exercises = require('./util').getExercises();

var hash = {};

_.each(values, function (validvalues, prop) {
    // init hash
    hash[prop] = hash[prop] || {};
    _.each(validvalues, function (value) {
        hash[prop][value] = 0;
    });
    // get stats
    _(exercises).each(function (exercise) {
        if (!exercise[prop]) return;
        _.chain([].concat(exercise[prop]))
         .intersection(validvalues)
         .each(function (value) {
            hash[prop][value] = hash[prop][value] + 1
         })
         .value();
    });
});

// print
console.log(JSON.stringify(hash, undefined, 4));
