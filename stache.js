// RequireJS Mustache template plugin
// http://github.com/jfparadis/requirejs-mustache
//
// An alternative to https://github.com/millermedeiros/requirejs-hogan-plugin
//
// Using Mustache Logic-less templates at http://mustache.github.com
// Using and RequireJS text.js at http://requirejs.org/docs/api.html#text
// @author JF Paradis
// @version 0.0.3
//
// Released under the MIT license
//
// Usage:
//   require(['backbone', 'stache!mytemplate'], function (Backbone, mytemplate) {
//     return Backbone.View.extend({
//       initialize: function(){
//         this.render();
//       },
//       render: function(){
//         this.$el.html(mytemplate({message: 'hello'}));
//     });
//   });
//
// Configuration: (optional)
//   require.config({
//     stache: {
//       extension: '.stache' // default = '.html'
//     }
//   });

/*jslint nomen: true */
/*global define: false */

define(['text', 'mustache'], function (text, Mustache) {
    'use strict';

    var sourceMap = {},
        buildMap = {};

    function parse(source){
        var partials = {};
        Mustache.parse(source).forEach(function partialLooker(element) {
            if(element[0]=== '>'){
                partials[element[1]] = true;
            }else if(Array.isArray(element[4])){
                element[4].forEach(partialLooker);
            } 
        });
        return Object.keys(partials);
    }

    return {
        version: '0.0.3',

        load: function load(moduleName, parentRequire, onload, config) {
            if (buildMap[moduleName]) {
                onload(buildMap[moduleName]);

            } else {
                var ext = (config.stache && config.stache.extension) || '.html';
                var path = (config.stache && config.stache.path) || '';
                text.load(path + moduleName + ext, parentRequire, function (source) {
                    sourceMap[moduleName] = source;
                    if (config.isBuild) {
                        onload();
                    } else {
                        var partials = parse(source);
                        buildMap[moduleName] = function build( view ) {
                            return Array.isArray(view)? view.map(build): Mustache.render( source, view, sourceMap ); 
                        };
                        if(partials.length){
                            (function loadWait(partials){
                                if(partials.length){
                                    var partialName = partials[0];
                                    if(buildMap[partialName]){
                                        loadWait(partials.slice(1));
                                    } else {
                                        load(partialName, parentRequire, function(_) {loadWait(partials.slice(1));}, config);
                                    }
                                } else {
                                    onload(buildMap[moduleName]);
                                }
                            })(partials);
                        } else {
                            onload(buildMap[moduleName]);
                        }
                    }
                }, config);
            }
        },

        write: function (pluginName, moduleName, write, config) {
            var source = sourceMap[moduleName],
                content = source && text.jsEscape(source);
            if (content) {
                var dependencies = parse(content);
                if(dependencies.length){
                    var partials = dependencies.map(function(partial) {return '"'+pluginName+'!'+partial+'"';}).join(',');
                    var params = dependencies.map(function(partial) {return partial;}).join(',');
                    var array = dependencies.map(function(partial) {return partial+':'+partial+'.source';}).join(',');
                    var buildTemplateSource = "define('{pluginName}!{moduleName}', ['mustache',{partials}], function (Mustache,{params}) { var template = '{content}', dependencies = {{array}}; Mustache.parse( template ); function build( view ) { return Array.isArray(view)? view.map(build): Mustache.render( template, view, dependencies );}; build.source=template; return build; });\n";
                    write.asModule(pluginName + '!' + moduleName,
                        buildTemplateSource
                        .replace('{pluginName}', pluginName)
                        .replace('{moduleName}', moduleName)
                        .replace('{partials}', partials)
                        .replace('{params}', params)
                        .replace('{array}', array)
                        .replace('{content}', content));
                } else {
                    var buildTemplateSource = "define('{pluginName}!{moduleName}', ['mustache'], function (Mustache) { var template = '{content}'; Mustache.parse( template ); function build( view ) { return Array.isArray(view)? view.map(build): Mustache.render( template, view );};build.source=template; return build; });\n";
                    write.asModule(pluginName + '!' + moduleName,
                        buildTemplateSource
                        .replace('{pluginName}', pluginName)
                        .replace('{moduleName}', moduleName)
                        .replace('{content}', content));
                }
            }
        }
    };
});