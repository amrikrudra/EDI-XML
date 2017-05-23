var jFile = require('jsonfile');
var filePath = './DataDB/country.code.json';
var uuidV1 = require('uuid/v1');
var dateFormat = require('dateformat');
var fs = require('fs');

var CountryDB = {
    GetCountry: function (req, res) {
        fs.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
            //  console.log(ddd);
            res.json(JSON.parse(ddd));
        });

    },

    SaveCountry: function (data, fileName, ClientName, cb) {
        var str = JSON.stringify(data);
        str = str.substr(1, str.length-2);
        fs.appendFile(filePath, str + ",", function (err) {
            if (err == null)
                cb("{\"Status\":\"OK\"}");
        });

    },
    DeleteDaily: function (req, res) {
        console.log('Data Record', req.body);
        jFile.readFile(filePath, function (err, obj) {
            index = obj.filter(function (item) {
                return (item.id == req.params.id);
            });
            index = obj.indexOf(index[0]);
            console.log('Index Of Record', index);
            if (index > -1) {
                obj.splice(index, 1);
                jFile.writeFile(filePath, obj, {

                }, function (err) {
                    console.error("rror", err);
                    if (err == null)
                        res.json(obj);
                });
            } else {
                res.json(obj);
            }
        });
    },
    UpdateDaily: function (req, res) {
        jFile.readFile(filePath, function (err, obj) {
            console.log(req.body.id)
            index = obj.filter(function (item) {
                return (item.id == req.body.id);
            });
            index = obj.indexOf(index[0]);
            if (index > -1) {
                obj[index] = req.body;
                jFile.writeFile(filePath, obj, {}, function (err) {
                    console.error("rror", err);
                    if (err == null)
                        res.json(obj);
                });
            }
        });
    }
,
    GetUnCode: function (COUNTRY,LOCNAME,SUBDIV,cb) {
        fs.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            var ddd = JSON.parse( "[" + obj.toString().substr(0, obj.toString().length - 1) + "]");
           
           var res=  index = ddd.filter(function (item) {
                return (item.COUNTRY.toString().toLowerCase() ==COUNTRY.toString().toLowerCase() && item.LOCNAME.toString().toLowerCase()==LOCNAME.toString().toLowerCase() && item.SUBDIV.toString().toLowerCase()==SUBDIV.toString().toLowerCase());
            });
          //  console.log("CCCC",res);
           if(res.length>0)
             cb(res[0]);
             else
             cb(null);
        });
    }

}

module.exports = CountryDB;