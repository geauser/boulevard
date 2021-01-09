# Boulevard

## Installation

```sh
npm i @geauser/boulevard -S
```

## Usage

This is what your Express server `index.js` file would look like :


```js
// index.js

const express   = require('express');
const boulevard = require('@geauser/boulevard');
const app       = express();

const router = boulevard.build({
  dir:     '/path/to/routes/folder', // All the route inside will automatically be used.
  pattern: '**/*.route.js', // Glob pattern of the route files.
  layers:  [
    'loggers', // Middlewares in the 'loogers' layer will be executed before...
    'validators', // ...the middlewares in the vaidators layer.
   ]
});

app.use('/my-route', router);

app.listen(1776);
```

And this is what a generic routing file would look like : 

```js
// foo.route.js

module.exports = [

  {
    path: '/foo',
    method: 'GET',
    loggers: [
    
      (req, res, next) => {
        // do some logging...
      },
      (req, res, next) => {
        // some more logging...
      },
    ],
    validators: [
      (req, res, next) => {
        // validate some data...
      },
    ],
    handler(req, res) {
      return res.send('Done!');
    }
  }

]

```



## API


### `build(opts)`

- `opts.dir` _`(String)`_ : Path to routes folder, no need to add an `index.js` file, all the route that have a name matching the `wildcard` parameter.

- `opts.pattern` _`(String)`_ : Glob pattern targetting the files containing the routes. 

- `opts.layers` _`(String[])`_ : Name of the custom middlewares layers. They will processed by Express in the same order they appear in the `layers` parameter.


## Route Fields

- `path`  _`(String)`_ : The path of the route. _**Note**_: If the router is registered on a parent route such as `app.use('/parent', router)`, the `path` field will be prefixed by the parent route.

- `method` _`(String)`_ : HTML request method name.

- `handler` _`(Function)`_ : Final request handler responsible for the request response.
