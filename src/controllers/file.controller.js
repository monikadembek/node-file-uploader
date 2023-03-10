import Router from 'express';
import { uploadSingleFile } from '../middlewares/upload.js';

export const fileController = new Router();

fileController.post('/upload', async (req, res) => {
	try {
		await uploadSingleFile(req, res);
		console.log('req.file', req.file);
		const  file = req.file;

		if (!file) {
			return res.status(400).json({ error: 'File missing' });
		}
		res.status(200).json({ message: `File ${file.originalname} uploaded successfully: `});
	} catch (error) {
		console.log('error:', error);
		if (error.code === 'LIMIT_FILE_SIZE') {
			return res.status(500).json({ error: "File cannot be larger than 2MB"});
		}
		res.status(500).json({ error: `Uploading file ${file.originalname} was not possible. ${error}` });
	}
});