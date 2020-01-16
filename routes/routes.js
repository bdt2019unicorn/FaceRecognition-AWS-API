var express = require('express'); 
var router = express.Router(); 

var bodyParser = require('body-parser'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false }); 

var multer = require("multer"); 
var upload = multer
(
    {
        dest: "./upload"
    }
);

router.get
(
    '/',
    function(request, response, next)
    {
        response.render("index"); 
    }
);

var upload_pictures_controller = require('../controller/upload_pictures_controller'); 
router.post
(
    '/upload_pictures', upload.single("file"), upload_pictures_controller.index
);

module.exports = router; 