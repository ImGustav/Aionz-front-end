import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import cors from 'cors';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// =======================================================
// CONFIGURAÇÃO DE CORS AJUSTADA
// =======================================================

const corsOptions = {
  origin: '*', // Permite todas as origens
  optionsSuccessStatus: 200, 
  maxAge: 3600 
};

// 1. Aplica o CORS globalmente como middleware (isso deve cobrir o OPTIONS)
app.use(cors(corsOptions)); 

// REMOVEMOS A LINHA PROBLEMÁTICA: app.options('*', cors(corsOptions));
// O middleware app.use(cors()) já é projetado para lidar com o OPTIONS.

/*
 * Se você tiver rotas de API aqui (ex: /api/produtos), o CORS já estará ativo!
 *
 * Example:
 *
app.get('/api/produtos/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Produto via SSR', price: 123.45 }); 
});
*/

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the PORT environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);