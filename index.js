const { Storage } = require('@google-cloud/storage');
const express = require("express");
const app = new express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
var admin = require("firebase-admin");
var fs = require('fs');
var serviceAccount = require("./key.json");
const bodyParser = require('body-parser');
var functions = require('./functions')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "no",
    databaseURL: "no"
});
var bucket = admin.storage().bucket();
const db = admin.firestore();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('views'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));
app.use(fileUpload({
    createParentPath: true
}));
app.get('/', function(req, res) {
    res.render('index', {
        message: "",
        imagePath: "daImages/pixel.png",
        imageTitle: "",
        imageDes: ""
    })
})
app.get('/join', function(req, res) {
    res.render('joinpage', {
        message: ""
    })
})
app.get('/reportImage', function(req, res) {
    res.render('report', {
        message: ""
    })
})
const storage = new Storage({
    keyFilename: './key.json',
});
var port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);
app.post('/report', async (req, res) => {
    var randomString = functions.randomString(6)
    var report = {
        url: req.body.imageLink,
        des: req.body.description
    }
    db.collection('pngShare').doc('Reports').collection('report').doc(randomString).set(report)
    res.render('report', {
        message: "Report Submitted Successfully."
    })
})
app.get('/image', function(req, res) {
    var imageName = req.query.imageID
    let bucketName = 'no'
    var filename = imageName;
    var downloadFile = async () => {
        let destFilename = './views/daImages/image.png';
        var options = {
            destination: destFilename
        };
        var ref = db.collection('pngShare').doc(imageName);
        const doc = await ref.get();
        if (!doc.exists) {
            res.render('seeImage', {
                message: "Sorry, looks like that image does not exist!",
                imagePath: "daImages/pixel.png",
                imageTitle: "",
                imageDes: ""
            });
        } else {
            await storage.bucket(bucketName).file('ImageShare' + '/' + filename + ".png").download(options);
            var postContents = {
                title: doc.data().title,
                description: doc.data().description
            }
            res.render('seeImage', {
                message: "",
                imagePath: "daImages/image.png",
                imageTitle: "Image Title/Name:" + postContents.title,
                imageDes: "Description of Image: " + postContents.description
            });
        }

    }
    downloadFile();
})

app.post('/uploadFile', async (req, res) => {
    try {
        if (!req.files) {
            res.render('index', {
                message: "You have no file chosen! Please choose a PNG file.",
                imagePath: "images/pixel.png",
                imageTitle: "",
                imageDes: ""
            })
        } else {
            var randStringName = functions.randomString(10);
            var randString = randStringName + ".png";
            var link = "http://localhost:8080/image?imageID=" + randStringName;
            console.log(randString)
            var avatar = req.files.fileName;
            var postContents = {
                title: req.body.ImageName,
                description: req.body.description,
                image: avatar.name
            }
            if (postContents.title == "") {
                postContents = {
                    title: "No Title Provided",
                    description: req.body.description,
                    image: avatar.name
                }
                await db.collection("pngShare").doc(randStringName).set(postContents);
                res.render('index', {
                    message: "Image uploaded successfully. Use the link " + link + " to share your photo with others!",
                    imagePath: "daImages/pixel.png",
                    imageTitle: "",
                    imageDes: ""
                });
            }
            if (postContents.description == "") {
                postContents = {
                    title: req.body.ImageName,
                    description: "No Description Provided",
                    image: avatar.name
                }
                await db.collection("pngShare").doc(randStringName).set(postContents);
                res.render('index', {
                    message: "Image uploaded successfully. Use the link " + link + " to share your photo with others!",
                    imagePath: "daImages/pixel.png",
                    imageTitle: "",
                    imageDes: ""
                });
            }
            if (postContents.title == "" && postContents.description == "") {
                postContents = {
                    title: "No Title Provided",
                    description: "No Description Provided",
                    image: avatar.name
                }
                await db.collection("pngShare").doc(randStringName).set(postContents);
                res.render('index', {
                    message: "Image uploaded successfully. Use the link " + link + " to share your photo with others!",
                    imagePath: "daImages/pixel.png",
                    imageTitle: "",
                    imageDes: ""
                });
            }
            if (postContents.title != "" && postContents.description != "") {
                await db.collection("pngShare").doc(randStringName).set(postContents);
                res.render('index', {
                    message: "Image uploaded successfully. Use the link " + link + " to share your photo with others!",
                    imagePath: "daImages/pixel.png",
                    imageTitle: "",
                    imageDes: ""
                });
            }
            var options = {
                destination: bucket.file('ImageShare' + "/" + randString),
                resumable: false
            }
            avatar.mv('./uploads/' + avatar.name);


            async function e() {
                var path = 'uploads/' + avatar.name
                await bucket.upload(path, options, function(err, file) {
                    console.log("File uploaded")
                });
                fs.unlink('uploads/' + avatar.name, function(err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
            }
            e();
        }
    } catch (err) {
        res.status(500).send(err);
        console.log("Error status 500")
        if (avatar.size < (2e+6)) {
            res.render('index', {
                message: "The file size is over 2MB! Please choose an image that is less than 2 Megabytes.",
                imagePath: "daImages/pixel.png",
                imageTitle: "",
                imageDes: ""
            })
        }
    }
});
