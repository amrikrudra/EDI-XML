var jFile = require('jsonfile');
var filePath = './DataDB/daily.json';
var uuidV1 = require('uuid/v1');
var dateFormat = require('dateformat');
var fs=require('fs');

var Daily = {
    GetDaily: function (req, res) {
        fs.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
                var ddd="["+obj.toString().substr(0,obj.toString().length-1)+"]";
              //  console.log(ddd);
            res.json( JSON.parse(ddd));
        });

    },

    SaveDaily: function (data,fileName,ClientName,cb) {
     
        // spoofing the DB response for simplicity
       
            var Newobj={
                "id":uuidV1(),
                "receiveTime": dateFormat(Date.now(),"mm/dd/yyyy hh:MM tt"),
                "client":ClientName,
                "fileName":fileName,
                "records":data
            };
           // obj.push(Newobj);
       
            fs.appendFile(filePath,  JSON.stringify( Newobj)+",",  function (err) {
              
                if (err == null)
                    cb( "{\"Status\":\"OK\"}");
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

    
}

module.exports = Daily;