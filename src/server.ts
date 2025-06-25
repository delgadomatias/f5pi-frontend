// import { AngularNodeAppEngine, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
// import compression from 'compression';
// import express from 'express';
// import { join } from 'node:path';

// const browserDistFolder = join(import.meta.dirname, '../browser');
// const app = express();
// const angularApp = new AngularNodeAppEngine();

// app.use(compression());
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: false,
//     redirect: false,
//   })
// );

// app.use((req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
//     .catch(next);
// });

// if (isMainModule(import.meta.url)) {
//   const port = process.env['PORT'] || 4200;
//   app.listen(port, (error) => {
//     if (error) {
//       throw error;
//     }

//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';

const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();

  // Example API endpoints can be defined here.
  // Uncomment and define endpoints as necessary.
  // const pathname = new URL(request.url).pathname;
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' });
  // }

  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
