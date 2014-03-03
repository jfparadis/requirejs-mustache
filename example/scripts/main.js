require({
    paths: {
        templates: '../templates',
        mustache: 'libs/mustache',
        text: 'libs/text',
        stache: 'libs/stache'
    }
}, ['stache!templates/message'], function (template) {
    'use strict';

    console.log('template = ' + template);
    document.body.innerHTML += template({message: 'Hello World!'});
});
