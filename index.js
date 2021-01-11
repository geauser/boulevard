const express = require('express');
const fs      = require('fs-jetpack');


function build({
  dir,
  pattern = '**/*.js',
  layers = ['middlewares', 'validators'],
}) {

  const router = express.Router();
  const files  = [];

  /**
   * Retrieve all the routing files corresponding with the Glob
   * pattern.
   */
  fs.cwd(dir).find({ matching: pattern }).forEach((fileName) => {

    const path = `${dir}/${fileName}`;

    files.push({
      path,
      routes: [...require(path)],
    });

  });

  if (!files.length) { console.warn('No routing files found.'); }

  files.forEach((file) => {

    file.routes.forEach((route) => {

      switch (true) {
        case !route.method:  throw new Error(`Missing 'method' in '${file.path}'`);
        case !route.path:    throw new Error(`Missing 'path' in '${file.path}'`);
        case !route.handler: throw new Error(`Missing 'handler' in '${file.path}'`);
      }

      const middlewares = [];

      /**
       * Concat in one array all the middleware functions of each
       * custom layers passed in parameter.
       *
       * For example if the given layers are:
       * ['a', 'b', 'c']
       * functions will be executed in each layer, in the
       * natural order and each layer will be executed as
       * they appear in the 'layers' parameter.
       */
      layers.forEach(layer => {
        middlewares.push(...(route[layer] || []));
      });

      // Make sure the given request method is in lowercase
      const method = route.method.toLowerCase();
      router[method](route.path, middlewares, route.handler);
    });

  });

  return router;
}

module.exports = { build };
