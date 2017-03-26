var fs = require('fs');
var pt = require('path');
var _ = require('lodash');
var json2md = require("json2md");
var fsextra = require('fs-extra');
var util;

json2md.converters.frontmatter = function (data) {
    return '``` \n' +
        `id: ${data.id} \n` +
        `type: ${data.type} \n` +
        `primary: ${data.primary} \n` +
        `secondary: ${data.secondary || 'none'} \n` +
        `equipment: ${(data.equipment || []).join(', ')} \n` +
        '``` \n'
}

json2md.converters.svg = function (data) {
    var base = __dirname + '/../dist/';
    return (_.map(data.svg, function (img) { return fs.readFileSync(base + img); } )).join('\n')
}

json2md.converters.linebreak = function () {
    return ``;
}

function getContent(folder, type) {
    return _.chain(fs.readdirSync(folder))
            .filter(function (file) {
                // ignore dot files/folders
                if (file.indexOf('.') === 0) return;
                var stats = fs.statSync(pt.join(folder, file));
                if (type === 'folder' && stats.isDirectory()) return true;
                if (type !== 'folder' && !stats.isDirectory()) return true;
            })
            .map(function (file) {
                return _.extend({
                    name: file,
                    path: pt.join(folder, file)
                }, type === 'folder' ? {} : { extension: _.last(file.split('.')) });
            })
            .value()
}


module.exports = util = {

    toMarkdown: function (data) {
        var content = [];
        content.push(
            { h1: data.title },
            { blockquote: data.primer },
            { frontmatter: data },
            { h2: 'Steps' },
            { ul: data.steps },
            { linebreak: '' },
            { h2: 'Tips' },
            { ul: data.tips || ['none'] },
            { linebreak: '' },
            { h2: 'Images' },
            { linebreak: '' },
            { svg: data }
            //{ img: _.map(data.svg, function (img) { return { source: '../' + img } }) }
        );
        return json2md(content);
    },

    getExercises: function () {
        return _.chain(util.getDirectories(__dirname + '/../src/exercises'))
                .map(function (dir) {
                    return _.extend(util.getData(dir.path + '/' + dir.name + '.json'));
                })
                .value();
    },

    getDirectories: function (path) {
        return getContent(path, 'folder');
    },

    getFiles: function (path) {
        return getContent(path, 'files');
    },

    getData: function (path) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    },

    copy: function (filepath, target) {
        var filename = _.last(filepath.split('/'));
        fsextra.copySync(filepath, target + '/' + filename);
    }
}
