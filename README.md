requirejs-mustache
==================

This is an AMD loader for [Mustache Logic-less templates](http://mustache.github.com) which can be used as a drop-in replacement to [millermedeiros/requirejs-hogan-plugin](http://github.com/millermedeiros/requirejs-hogan-plugin/blob/master/hgn.js)


## Overview

- Uses an external MustacheJS engine (referenced by the Mustache team).
- Uses the official ``text`` loader plugin maintained by the RequireJS team.
- You don't have to specify the template file extension (``.html is assumed``, but this is configurable).

Notes:

- The text library can be removed at build-time using ``r.js``.
- The extension ``.html`` is assumed, and this makes loading templates similar to loading JavaScript files with RequireJS (all extensions are assumed).

## Changelog

0.0.1 Initial version

0.0.2 Various updates:
- Add template path option to stache.js (thanks drewrichards)
- Updated require.js to 2.1.8 , and r.js to 2.1.8
- Updated handlebar.js to 0.7.2

0.0.3 Merged pull request from Rafael Bodill:
- Converted library to lowercase

## Installation

Download MustacheJS and RequireJS-text:

- [MustacheJS](http://github.com/janl/mustache.js)
- [RequireJS-text](http://requirejs.org/docs/download.html#text)

Typically, you would place them in a ``scripts/libs`` folder then create a ``scripts/main.js`` file to alias them (no need to shim Mustache):

```
require.config({
  paths: {
    Mustache: 'libs/mustache',
    text: 'libs/text'
    stache: 'libs/stache'
  }
});
```>

## Usage

Specify the plugin using ``stache!`` followed by the template file:

```
require(['backbone', 'stache!template'], function (Backbone, template) {
  return Backbone.View.extend({
    initialize: function(){
      this.render();
    },
    render: function(){
      this.$el.html(template({message: 'hello'}));
  });
});
```

## Customization

You can specify the template file extension in your main.js:

```
require.config({

  // some paths and shims

  stache: {
    extension: '.stache', // default = '.html'
    path: '/templates/' // default = ''
  }
});
```

## Optimization

This plugin is compatible with [r.js](http://requirejs.org/docs/optimization.html).

Optimization brings three benefits to a project:

- The templates are bundled within your code and not dynamically loaded which reduces the number of HTTP requests.
- The templates are partially pre-compiled before being bundled which reduces the work the client has to do.

The most important build options are:

```stubModules: ['text', 'stache']```

The list of modules to stub out in the optimized file, i.e. the code is replaced with ``define('module',{});`` by ``r.js``

```removeCombined: true```

Removes from the output folder the files combined into a build.

## Example

### Using an existing web server

Copy the ``example`` and ``example-build`` folders to your web server (``text`` is not compatible with the ``file://`` protocol and opening ``index.hml`` directly from your browser will not work).

### Using a test server

Alternatively, you can use Connect and NodeJS to spin a web server:

Install ``connect`` using ``npm`` and launch the server with NodeJS:

```
  $ npm install -g connect
  $ npm link connect
  $ node server.js
```

Go to [http://localhost:9000/example](http://localhost:9000/example). Your browser should load:

- index.html
- require.js
- main.js
- stache.js
- mustache.js
- text.js
- message.html

Go to [http://localhost:9000/example-build](http://localhost:9000/example-build). Your browser should load:

- index.html
- require.js
- main.js







