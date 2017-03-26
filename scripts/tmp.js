var _ = require('lodash');
var values = require('./test.json');
var exercises = require('./util').getExercises();

var hash = {};

var prop = 'primary';
// get stats
_(exercises).each(function (exercise) {
    if (!exercise[prop]) return;
    hash[prop] = hash[prop] || {};
    _.chain([].concat(exercise[prop]))
     .each(function (value) {
        hash[prop][value] = (hash[prop][value] || 0) + 1
     })
     .value();
});

// print
console.log(JSON.stringify(hash, undefined, 4));
