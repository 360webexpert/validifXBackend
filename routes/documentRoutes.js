// routes/otpRoutes.js

const documentController = require('../controllers/documentController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const express = require('express');

module.exports = app => {
    const router = express.Router();

    // Configure Multer for handling file uploads
    // const storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         const uploadPath = './uploads/';
    //         if (!fs.existsSync(uploadPath)) {
    //             fs.mkdirSync(uploadPath);
    //         }
    //         cb(null, uploadPath);
    //     },
    //     filename: (req, file, cb) => {
    //         cb(null, Date.now() + path.extname(file.originalname));
    //     },
    // });
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads'));
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    })
    const upload = multer({
        storage: storage,
        limits: { fileSize: 10 * 1024 * 1024 },
        // const upload = multer({
        //     storage: storage,
        //     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
        fileFilter: (req, file, cb) => {
            const allowedFileTypes = /jpeg|jpg|png/; // Allow only these file types
            const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedFileTypes.test(file.mimetype);
            if (extname && mimetype) {
                return cb(null, true);
            } else {
                cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
            }
        },
    });

    // Endpoint to upload a file
    router.post('/upload', upload.array('file'), (req, res) => {
        // if (!req.file) {
        //     return res.status(400).send('No file uploaded.');
        // }

        console.log('File uploaded successfully:', req.files, "xxxxxxxxxxx");
        const fileUrl = req.files.map(elem => elem.filename);
        res.status(201).send({ message: 'File uploaded successfully!', fileUrl });
    });

    // Endpoint to get a file by its filename
    router.get('/file/:filename', (req, res) => {
        const uploadPath = path.resolve('./uploads/');
        const filename = req.params.filename;
        const filePath = path.join(uploadPath, filename);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).send('File not found.');
            }
            res.sendFile(filePath);
        });
    });


    router.post("/document", documentController.documentuser)

    router.get('/getalldocumentUsers', documentController.getAllDocumentUsers);

    app.use('/api', router);
};
