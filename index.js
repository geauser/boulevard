const express = require('express');
const fs      = require('fs-jetpack');


function createRouter(routesPath, matching = '**/*.js') {

  const router = express.Router();
  const files  = [];

  fs.cwd(routesPath).find({ matching }).forEach((fileName) => {

    const path = `${routesPath}/${fileName}`;

    files.push({
      path,
      routes: [...require(path)],
    });

  });


  files.forEach((file) => {

    file.routes.forEach((route) => {

      if (!route.method) {
        throw new Error(`Missing 'method' in file: '${file.path}'\n`);
      }

      if (!route.path) {
        throw new Error(`Missing 'path' in file: '${file.path}'\n`);
      }

      if (!route.handler) {
        throw new Error(`Missing 'handler' in file: '${file.path}'\n`);
      }

      route.validators  = route.validators  || [];
      route.middlewares = route.middlewares || [];

      router[route.method.toLowerCase()](route.path, route.validators.concat(route.middlewares).concat([route.handler]));
    });

  });

  return router;
}

module.exports = { createRouter };
