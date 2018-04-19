'use strict';

const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./CRUD_method/database')
const ExifImage = require('exif').ExifImage;
const https=require('https');
const fs=require('fs');
const upload = multer({ dest: 'public/upload' });

const app = express();
//app.listen(5000);

const option={
  key: fs.readFileSync('key.pem'),
  cert : fs.readFileSync('certificate.pem')
}

https.createServer(option,app).listen(5000);





app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('form.html'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

database.connectdatabase('mongodb://localhost/bill');

//Schema
const Schema = database.createSchema();

// Model
const Model = database.createModel('Model', Schema);


//give the middle ware multer to upload file
app.post('/reg', upload.single('image'), (req, resp, next) => {
  console.log(req.file);

  req.body.original = 'public/upload/' + req.file.filename;
  console.log('uploaded');
  next();
});



app.post('/reg', (req, resp) => {

  let api = (locData) => {
    const Image = new Model({
      name: req.body.name,
      dob: req.body.dob,
      gender: req.body.gender,
      color: req.body.color,
      weight: req.body.weight,
      image: 'upload/' + req.file.filename,
      location: locData
    });
    Image.save();
    console.log(Image);

  }


  try {
    new ExifImage({ image: req.body.original }, function (error, exifData) {
      if (error) {
        const emptyloc = {
          GPSLatitudeRef: '',
          GPSLatitude: [],
          GPSLongitudeRef: '',
          GPSLongitude: [],
          GPSAltitudeRef: null,
          GPSAltitude: null,
          GPSTimeStamp: [],
          GPSDateStamp: ''
        }

        console.log('Empty loc : ' + emptyloc);

        api(emptyloc);
        //console.log('Error: '+error.message);
      }


      else {
        //console.log(exifData);
        api(exifData.gps);

      }
    });
  } catch (error) {
    console.log('Error: ' + error.message);
  }



  //console.log(Image);
  resp.redirect('index.html')
})

//resp.redirect('form.html');

app.get('/', (req, resp) => {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");                                                        // to home page
  resp.redirect('index.html');
})

app.get('/alldata', (req, res) => {

  Model.find({}, (err, data) => {
    res.json(data);
  })
})
app.post('/update', (req, res) => {

  Model.findById(req.body.id, (err, data) => {
    if (err) throw err;
    console.log(data.name);
    data.name = req.body.name;
    data.dob = req.body.dob;
    data.gender = req.body.gender;
    data.color = req.body.color;
    data.weight = req.body.weight;
    data.save();

  });
  res.redirect('/')
})


app.get('/search', (req, res) => {
  // console.log('Query  ' + req.query.search);
  res.redirect('search.html');
})



app.post('/a', (req, res) => {
  console.log(req.body.word);


  Model.find({ name: req.body.word }, (err, data) => {
    if (err) res.send(err);
    console.log(data);
    res.send(data);
  })
})

app.post('/delete', (req, res) => {
  console.log(req.body.word);
  Model.findByIdAndRemove(req.body.word,(err,res)=>{
    if(err) throw err;
    console.log(res);    
  })
})



/*
app.post('/searchData', (req, res) =>{
  console.log('Query  ' + req.body.word);

  Model.find({ name: req.body.word }, (err, data) => {
    if (err) res.send(err);
    console.log(data);
    res.send(data);

  })


})
*/




/* Points to remember*/
//change of https and http for fetch url
//check database 
