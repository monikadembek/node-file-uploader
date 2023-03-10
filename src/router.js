import { Router } from 'express';
import { fileController } from './controllers/file.controller.js';

export const router = new Router();

router.use('/files', fileController);