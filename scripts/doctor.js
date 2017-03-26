var _ = require('lodash');
var fs = require('fs');
var util = require('./util');

// ensure data structure
_.each(util.getDirectories(__dirname + '/../src/exercises'), function (dir) {
    var data = _.extend(util.getData(dir.path + '/' + dir.name + '.json'));
    data = {
        id: data.id,
        name: data.name,
        title: data.title,
        //alias: data.alias ? data.alias : [],
        //region: data.region || [],
        primer: data.primer || '',
        type: data.type || '',
        primary: _.isArray(data.primary) ? data.primary : _.map(data.primary.split(','), function (str) { return str.trim(); }),
        secondary: _.isArray(data.secondary) ? data.secondary : _.chain(data.secondary.split(',')).compact().map(function (str) { return str.trim(); }).value(),
        equipment: data.equipment || [],
        steps: data.steps || [],
        tips: data.tips || [],
        references: data.references || []
    }
    fs.writeFileSync(dir.path + '/' + dir.name + '.json', JSON.stringify(data, undefined, 4), 'utf8');
});
