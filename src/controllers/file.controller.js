import Router from 'express';
import { uploadSingleFile } from '../middlewares/upload.js';
import * as fs from 'node:fs';
import { unlink } from 'node:fs';
import path from 'node:path';

export const fileController = new Router();
const uploadsFolder = "/resources/static/assets/uploads/";

fileController.post('/upload', async (req, res) => {
	try {
		await uploadSingleFile(req, res);
		const  file = req.file;

		if (!file) {
			return res.status(400).json({ error: 'File missing' });
		}
		res.status(200).json({ message: `File ${file.originalname} uploaded successfully` });
	} catch (error) {
		console.log('error:', error);
		if (error.code === 'LIMIT_FILE_SIZE') {
			return res.status(500).json({ error: "File cannot be larger than 2MB"});
		}
		res.status(500).json({ error: `Uploading file ${file.originalname} was not possible. ${error}` });
	}
});

fileController.get('', (req, res) => {
  const uploadsFolderPath = path.join(__basedir, uploadsFolder);
  const filesList = [];

  fs.readdir(uploadsFolderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: `Error occured while getting list of files: ${err}` });
    }

    files.forEach((file) => {
      filesList.push({
        filename: file,
        url: process.env.BASEURL + file
      });
    });
    
    res.status(200).json({ filesList });
  });
});

fileController.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const uploadsFolderPath = path.join(__basedir, uploadsFolder);

  res.download(uploadsFolderPath + filename, filename, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error occurred while downloading file.' + err });
    }
  });
});

fileController.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const uploadsFolderPath = path.join(__basedir, uploadsFolder);

  unlink(uploadsFolderPath + filename, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Deleting file failed.' + err });
    }
    res.status(200).json({ message: 'File was deleted' });
  });
});