//hi
const {Storage} = require('@google-cloud/storage');
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
  storageBucket: "gs://poopnet-4fb22.appspot.com",
	databaseURL: "https://poopnet-4fb22.firebaseio.com"
});
var bucket = admin.storage().bucket();
const db = admin.firestore();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('views'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(fileUpload({
  createParentPath: true
}));
app.get('/', function(req, res) {
	res.render('index', {message:"", imagePath:"images/pixel.png", imageTitle:"", imageDes: ""})
})
const storage = new Storage({
  keyFilename: './key.json',
});
var port = process.env.PORT || 3000;
app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);
app.post('/seeImage', async (req, res) => {
	var imageName = req.body.imageName
	let bucketName = 'gs://poopnet-4fb22.appspot.com'
	var filename = imageName;
	var downloadFile = async() => {
		let destFilename = './views/images/image.png';
		var options = {
			destination: destFilename
		};
		await storage.bucket(bucketName).file('ImageShare' + '/' + filename + ".png").download(options);
		var ref = db.collection('pngShare').doc(filename);
		var doc = await ref.get();
		var postContents = {
			title: doc.data().title,
			description: doc.data().description
		}

		res.render('index', {message:"", imagePath:"images/image.png", imageTitle:"Image Title/Name:" + postContents.title, imageDes: "Description of Image: " + postContents.description});
	} 
	downloadFile();
})

app.post('/uploadFile', async (req, res) => {
    try {
        if(!req.files) {
          res.render('index', {message:"You have no file chosen! Please choose a PNG file.", imagePath:"images/pixel.png", imageTitle:"", imageDes: ""})
        }
				else {
					var randStringName = functions.randomString(10)
					var randString = randStringName + ".png";
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
							res.render('index', {message:"File uploaded successfuly! Enter the code " + randStringName + " Into the access code form to see or share your image! Please refresh the page before uploading another image.", imagePath:"images/pixel.png", imageTitle:"", imageDes: ""});
						}
						if (postContents.description == "") {
							postContents = {
								title: req.body.ImageName,
								description: "No Description Provided",
								image: avatar.name
							}
							await db.collection("pngShare").doc(randStringName).set(postContents);
							res.render('index', {message:"File uploaded successfuly! Enter the code " + randStringName + " Into the access code form to see or share your image! Please refresh the page before uploading another image.", imagePath:"images/pixel.png", imageTitle:"", imageDes: ""});
						}
						if (postContents.title == "" && postContents.description == "") {
							postContents = {
								title: "No Title Provided",
								description: "No Description Provided",
								image: avatar.name
							}		
							await db.collection("pngShare").doc(randStringName).set(postContents);	
							res.render('index', {message:"File uploaded successfuly! Enter the code " + randStringName + " Into the access code form to see or share your image! Please refresh the page before uploading another image.", imagePath:"images/pixel.png", imageTitle:"", imageDes: ""});				
						}
						if (postContents.title != "" && postContents.description != "") {
							await db.collection("pngShare").doc(randStringName).set(postContents);	
							res.render('index', {message:"File uploaded successfuly! Enter the code " + randStringName + " Into the access code form to see or share your image! Please refresh the page before uploading another image.", imagePath:"images/pixel.png", imageTitle:"", imageDes: ""});		
						}
					  var options = {
							destination: bucket.file('ImageShare' + "/" + randString),
							resumable: false
						}
            avatar.mv('./uploads/' + avatar.name);


						async function e() {
						var path = 'uploads/' + avatar.name
						await bucket.upload(path, options, function(err, file) {console.log("File uploaded")});
						fs.unlink('uploads/' + avatar.name, function (err) {if (err) throw err; console.log('File deleted!');});
						}	
						e();	
        }
    } catch (err) {
        res.status(500).send(err);
				console.log("Error status 500")
				if (avatar.size < (2e+6)) {
					res.render('index', {message: "The file size is over 2MB! Please choose an image that is less than 2 Megabytes.", imagePath:"images/pixel.png", imageTitle:"", imageDes: ""})
				} 
    }
});