var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cronjob = require('node-cron-job');
var CountryExcel = require('./SERVICE/country.js');
var fs = require('fs');
var multer = require('multer');
var config = require('config');
//var index= require('./routes/index');
//var tasks =require('./routes/tasks');

var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'DataDB')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

var upload = multer({
  storage: storage
}).any();
// View Engine

app.set('views', path.join(__dirname, 'client/dist'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folders Angulat Stuff
app.use(express.static(path.join(__dirname, 'client/dist')));

// Body Parser; Middle Layer

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.all('/*', function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  res.setHeader('Access-Control-Allow-Credentials', true);
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});


// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed






app.use('/api/', require('./routes'));
app.post('/fileupload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log("Error" + err);
    } else {
      console.log("File Name Upload");
      CountryExcel.ProcessCountryExcel();
    }
    res.send("Done");
  })


});
// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.redirect('/');
});

//app.use('/',index);
//app.use('/api',tasks);
 var AppSetting = config.get("Application");
var port =  AppSetting.portNumber; 
//app.listen(process.env.PORT, function () {
app.listen(port, function () {
  console.log('Application is runnning on port ' + port);
  cronjob.setJobsPath(__dirname + '/jobs/xml.job.js'); // Absolute path to the jobs module. 
  cronjob.startJob('CheckNewFiles');
cronjob.startJob('PurgeArchiveData');

});