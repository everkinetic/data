var _ = require('lodash');
var util = require('./util');
var fs = require('fs');
var path = require('path');
var fsextra = require('fs-extra');
var SVGO = require('svgo');

// default config
var svgo = new SVGO();

// globals
var attr = 'name';

// paths
var base = __dirname + '/../dist';
var png = base + '/png';
var svg = base + '/svg';
var md = base + '/md';

// ensure existance
if (fs.existsSync(base)) fsextra.removeSync(base);
if (!fs.existsSync(base)) fs.mkdirSync(base);
if (!fs.existsSync(png)) fs.mkdirSync(png);
if (!fs.existsSync(svg)) fs.mkdirSync(svg);
if (!fs.existsSync(md)) fs.mkdirSync(md);

// create
var collection = [];
_.each(util.getDirectories(__dirname + '/../src/exercises'), function (dir) {

    // get
    var data = _.extend(util.getData(dir.path + '/' + dir.name + '.json'), { svg: [], png: [] });

    // process
    _.chain(util.getFiles(dir.path))
        .filter(function (file) { return /(png|svg)/.test(file.extension) })
        .sortBy(function (file) { return file.extension + file.name; })
        .each(function (file) {

            // add to data
            var relative = file.extension + '/' + file.name;

            // simple copy png
            if (file.extension === 'png') {
                util.copy(file.path, file.extension === 'png' ? png : svg);
                data.png.push(relative);
            }
            // optimize svg
            if (file.extension === 'svg') {
                var svgcontent = fs.readFileSync(file.path, 'utf8');
                svgo.optimize(svgcontent, function(result) {
                    fs.writeFileSync(path.join(svg, file.name), result.data);
                    data.svg.push(relative);
                });
            }
        })
        .value();

    collection.push(data);
    fs.writeFileSync(md + '/' + data[attr] + '.md', util.toMarkdown(data));
});

// write collection to file
fs.writeFileSync(__dirname + '/../dist/exercises.json', JSON.stringify(collection, undefined, 4), 'utf8');
fs.writeFileSync(__dirname + '/../dist/exercises.md', getLinks(), 'utf8');

// collection to md links
function getLinks() {
    return _.chain(collection)
        .sortBy(function (data) { return data.title; })
        .map(function (data) {
            var path = `md/${data[attr]}.md`;
            return `- [${data.title}](${path})`;
        })
        .join('\n')
        .value();
}
