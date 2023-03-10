import express from 'express';
import { router } from './router.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace('\\src', '');
console.log('dirname', __dirname);
global.__basedir = __dirname;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('uncaught exception');
  console.error(err);
});