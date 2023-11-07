import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(222)
    cb(null, '/uploads');
  },
  filename(req, file, cb) {
    console.log(111)
    cb(
      null,
      `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { files: 5, fileSize: 1024 * 1024 * 20 }
});


export default upload;