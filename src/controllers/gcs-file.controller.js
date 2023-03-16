import Router from 'express';
import { Storage } from '@google-cloud/storage';
import { storeSingleFileInMemory } from '../middlewares/upload.js';

export const gcsFileController = new Router();

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucketName = 'node-file-uploader';
const bucketUrl = `https://storage.googleapis.com/${bucketName}`;
const bucket = storage.bucket(bucketName);

gcsFileController.post('/upload', async (req, res) => {
  const options = {
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
      .on('finish', async () => {
        const fileUrl = `${bucketUrl}/${file.originalname}`;

        await fileBlob.makePublic()
          .catch(err => {
            console.log('Error when making file public', err);
            return res.status(200).json({ 
              message: `File ${file.originalname} uploaded to ${bucketName}, but it couldn't be made public.`,
              url: fileUrl
            }); 
          });
        
        res.status(200).json({ 
          message: `File ${file.originalname} uploaded to ${bucketName}`,
          url: fileUrl
        });
      })
      .end(file.buffer);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Couldn\'t upload the file' });
  }  
});

gcsFileController.get('', async (req, res) => {
  const filesList = [];
  const [files] = await bucket.getFiles().catch(err => {
    return res.status(500).json({ error: 'Error occured when getting list of files' });
  });

  files.forEach(file => {
    const fileUrl = `${bucketUrl}/${file.name}`;
    filesList.push({ 
      fileName: file.name,
      url: fileUrl
    });
  });

  res.status(200).json({ files: filesList });
});
