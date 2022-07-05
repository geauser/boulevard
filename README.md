# Boulevard

## Installation

```sh
npm i @geauser/boulevard -S
```

## Usage

This is what your Express server `index.ts` file would look like :


```ts
// index.ts
import express from 'express';
import boulevard from '@geauser/boulevard';

const app = express();
const router = boulevard.build('/path/to/routes/folder', '**/*.route.js');

app.use('/my-route', router);

app.listen(1776);
```

And this is what a generic routing file would look like : 

```ts
// foo.route.ts
import { Boulevard } from '@geauser/boulevard';

// Use Boulevard.Routes type for TS validation (optional)
const routes: Boulevard.Routes = [

  {
    // This will match /my-route/foo GET requests
    path: '/foo',
    method: 'GET',
    middlewares: [
      (req, res, next) => { /* ... */ },
      (req, res, next) => { /* ... */ },
      // ...
    ]
    handler(req, res) {
      return res.send('Done!');
    }
  }

]
```

> Note that `Boulevard.Routes` is an alias for `Boulevard.Route[]`.



## API


#### `build(directory: string, globPattern: string) => Express.Router`:

- `directory`: Directory where the glob pattern will be used.
- `globPattern`: Glob pattern to get the route files.

#### `Boulevard.Route`:

- `path: string`: The path of the route. _**Note**_: If the router is registered on a parent route such as `app.use('/parent', router)`, the `path` field will be prefixed by the parent route.
- `method: string`: HTML request method name.
- `middlewares: Function[]`: List of Express middlewares, will be executed in order.
- `handler: Function[]`: Final request handler responsible for the request response.
