import Router from 'express';
import { Storage } from '@google-cloud/storage';
import { storeSingleFileInMemory } from '../middlewares/upload.js';

export const gcsFileController = new Router();

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucketName = 'node-file-uploader';
const bucket = storage.bucket(bucketName);

gcsFileController.post('/upload', async (req, res) => {
  const options = {
    public: true,
    resumable: false
  };

  try {
    await storeSingleFileInMemory(req, res);
    const  file = req.file;
    
    if (!file) {
      res.status(500).json({ error: 'File missing' });  
    }

    const fileBlob = bucket.file(file.originalname);

    fileBlob.createWriteStream(options)
      .on('error', (err) => {
        console.log('onerror: ', err);
        res.status(500).json({ error: `Couldn\'t upload the file. ${err} ` });    
      })
      .on('finish', () => {
        const url = `https://storage.googleapis.com/${bucketName}/${file.originalname}`;
        res.status(200).json({ 
          message: `File ${file.originalname} uploaded to ${bucketName}`,
          fileUrl: url
        });
      })
      .end(file.buffer);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Couldn\'t upload the file' });
  }  
});
