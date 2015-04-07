require({
    paths: {
        templates: '../templates',
        mustache: 'libs/mustache',
        text: 'libs/text',
        stache: 'libs/stache'
    }
}, ['stache!templates/message', 'stache!templates/messageWithPartial'], function (template, templateWithPartial) {
    'use strict';

    console.log('template = ' + template);
    document.body.innerHTML += template({message: 'Hello World!'});

    console.log('template Partial = ' + template);
    document.body.innerHTML += templateWithPartial({message: 'Hello Partials!'});
});
