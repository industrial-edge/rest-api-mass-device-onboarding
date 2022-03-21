const express = require('express');
const fs = require("fs")
const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'devices')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        // or 
        // uuid, or fieldname
        cb(null, originalname);
    }
})
const upload = multer({ storage }); // or simply { dest: 'uploads/' }
app.use(express.static('public'))

app.post('/upload', upload.array('avatar'), (req, res) => {
    if (fs.existsSync("./devices/edge_devices.xlsx")) {
        //file exists
        res.send("<html><body><h1  style='color:green;text-align:center;margin-top: 2em;'> File edge_devices.xlsx has been uploaded</h1></body></html>")

    } else {
        res.send("<html><body><h1   style='color:red;text-align:center;margin-top: 2em;'> The file edge_devices.xlsx is not located in the /devices folder. Try again.</h1></body></html>")
    }
});


app.listen(3001);