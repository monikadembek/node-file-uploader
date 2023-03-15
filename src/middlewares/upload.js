import util from "util";
import multer from "multer";
import path from 'node:path';

const maxSize = 2 * 1024 * 1024;
const uploadFolder = "/resources/static/assets/uploads/";

const diskStorage = multer.diskStorage({ 
  destination: function(req, file, cb) {
    cb(null, path.join(__basedir, uploadFolder));
  },
  filename: function(req, file, cb) {
    console.log('file', file);
    cb(null, file.originalname);
  } 
});

const uploadFile = multer({
  storage: diskStorage,
  limits: { fileSize: maxSize }
}).single("file");

export const uploadSingleFile = util.promisify(uploadFile);

const storeFileInMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize }
}).single("file");

export const storeSingleFileInMemory = util.promisify(storeFileInMemory);

