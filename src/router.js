import { Router } from 'express';
import { fileController } from './controllers/file.controller.js';
import { gcsFileController } from './controllers/gcs-file.controller.js';

export const router = new Router();

router.use('/files', fileController);
router.use('/gcs/files', gcsFileController);