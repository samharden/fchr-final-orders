# AngularJS Finalorder Application


## Overview

This site is a directory of the Final Orders of the Florida Commission on Human
Relations built entirely in AngularJS.

Why build this site?

Because the FCHR's Final Orders site sucks, and this stuff is public record.

## Clone and run locally

clone this to your machine, then cd into the directory.
In terminal, check your node installation by typing "node --version" and hit enter.

Then: "npm install"

Start the server: "npm start"

Go to localhost:8000 on your browser.

## Application Directory Layout

```
app/                     --> all the source code of the app (along with unit tests)
  bower_components/...   --> 3rd party JS/CSS libraries, including Angular and jQuery
  core/                  --> all the source code of the core module (stuff used throughout the app)
    checkmark/...        --> files for the `checkmark` filter, including JS source code, specs
    finalorder/...            --> files for the `core.finalorder` submodule, including JS source code, specs
    core.module.js       --> the core module
  finalorder-detail/...       --> files for the `finalorderDetail` module, including JS source code, HTML templates, specs
  finalorder-list/...         --> files for the `finalorderList` module, including JS source code, HTML templates, specs
  finalorders/...             --> static JSON files with finalorder data (used to fake a backend API)
  app.animations.css     --> hooks for running CSS animations with `ngAnimate`
  app.animations.js      --> hooks for running JS animations with `ngAnimate`
  app.config.js          --> app-wide configuration of Angular services
  app.css                --> default stylesheet
  app.module.js          --> the main app module
  index.html             --> app layout file (the main HTML template file of the app)

e2e-tests/               --> config and source files for e2e tests
  protractor.conf.js     --> config file for running e2e tests with Protractor
  scenarios.js           --> e2e specs

node_modules/...         --> development tools (fetched using `npm`)

scripts/                 --> handy scripts
  private/...            --> private scripts used by the Angular Team to maintain this repo
  update-repo.sh         --> script for pulling down the latest version of this repo (!!! DELETES ALL CHANGES YOU HAVE MADE !!!)

bower.json               --> Bower specific metadata, including client-side dependencies
karma.conf.js            --> config file for running unit tests with Karma
package.json             --> Node.js specific metadata, including development tools dependencies
```


## Contact
