import express from 'express';
import fs from 'fs-jetpack';

export namespace Boulevard {

  export interface Route {
    path: string;
    method: string;
    middlewares?: Function[],
    handler: Function;
  }

  export type Routes = Route[];

}

/**
 * Build the routes in the specified route directory and
 * return an Express router.
 *
 * @param directory Directory where the glob pattern will be used
 * @param globPattern Glob pattern to get the route files.
 * @returns Express router
 */
function build(directory: string, globPattern = '**/*.js') {

  const router = express.Router();
  const routeFiles: { path: string, routes: Boulevard.Route[] }[]  = [];

  /**
   * Retrieve all the routing files corresponding with the Glob
   * pattern and extract the route object from each.
   */
  fs.cwd(directory).find({ matching: globPattern }).forEach((fileName) => {

    const path = `${directory}/${fileName}`;
    const routes: Boulevard.Route[] = [...require(path).default];

    routeFiles.push({
      // Extract the path as well to display where the
      // problem is, in case of an error.
      path,

      // Get all the sub-routes of the route file
      // @ts-ignore
      routes,
    });

  });

  if (!routeFiles.length) { console.warn('[Boulevard] Warning, No routing files found.'); }

  routeFiles.forEach((routeFile) => {

    // Parse all the routes in routeFile
    routeFile.routes.forEach((route) => {

      if (!route.method)  throw new Error(`[Boulevard] Missing 'method' in route '${routeFile.path}'`);
      if (!route.path)    throw new Error(`[Boulevard] Missing 'path' in route '${routeFile.path}'`);
      if (!route.handler) throw new Error(`[Boulevard] Missing 'handler' in route '${routeFile.path}'`);

      // Make sure the given request method is in lowercase
      const method = route.method.toLowerCase();

      // @ts-ignore
      router[method](route.path, route.middlewares ?? [], route.handler);
    });

  });

  return router;
}


export default { build };
