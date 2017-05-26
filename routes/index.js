var express = require('express');
var router = express.Router();

var Setting = require('../Service/setting.js'); // Authentication 
var User = require('../Service/user.js'); // Authentication 
var Freight = require('../Service/freight.js'); // Authentication 
var Daily = require('../Service/daily.js'); // Authentication 
var XmlLog = require('../Service/xmllog.js'); // Authentication 
var Country = require('../Service/country.js'); // Authentication 

router.get('/', function (req, res, next) {
    res.render('index.html');

});

router.get('/Setting', Setting.GetSetting);
router.post('/Setting', Setting.SaveSetting);
router.put('/Setting/:id', Setting.UpdateSetting);
router.delete('/Setting/:id', Setting.DeleteSetting);


router.get('/User', User.GetUser);
router.post('/User', User.SaveUser);
router.put('/User/:id', User.UpdateUser);
router.delete('/User/:id', User.DeleteUser);
router.post('/login', User.ValidateUser);


router.get('/Freight', Freight.GetFreight);
router.post('/Freight', Freight.SaveFreight);
router.put('/Freight/:id', Freight.UpdateFreight);
router.delete('/Freight/:id', Freight.DeleteFreight);

router.get('/dailytran', Daily.GetDaily);
router.post('/dailytran', Daily.SaveDaily);
router.put('/dailytran/:id', Daily.UpdateDaily);
router.delete('/dailytran/:id', Daily.DeleteDaily);
router.get('/dailydownload/:id', Daily.download);


router.get('/xmllog', XmlLog.GetXmlLog);
router.post('/xmllog', XmlLog.SaveXmlLog);
router.put('/xmllog/:id', XmlLog.UpdateXmlLog);
router.delete('/xmllog/:id', XmlLog.DeleteXmlLog);
router.get('/xmldownload/:id', XmlLog.download);
router.get('/xmlresend/:id', XmlLog.resend);
router.get('/xmlresendb/:id', XmlLog.resendb);


router.get('/country', Country.GetCountry);
//router.post('/country', Country.SaveDaily);
//router.put('/country/:id', XmlLog.UpdateXmlLog);
//router.delete('/country/:id', XmlLog.DeleteXmlLog);
module.exports = router;