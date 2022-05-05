const express = require('express');
const fs = require("fs")
const multer = require('multer');
const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'devices')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
// upload using multer
const upload = multer({ storage });
// host static html site
app.use(express.static('public'))

app.post('/upload', upload.array('avatar'), (req, res) => {
    if (fs.existsSync("./devices/edge_devices.xlsx")) {
        res.send("<html><body><h1  style='color:green;text-align:center;margin-top: 2em;'> File edge_devices.xlsx has been uploaded</h1></body></html>")
    } else {
        res.send("<html><body><h1   style='color:red;text-align:center;margin-top: 2em;'> The file edge_devices.xlsx is not located in the /devices folder. Try again.</h1></body></html>")
    }
});


app.listen(3001, () => {
    console.log("Listening on port 3001");
})