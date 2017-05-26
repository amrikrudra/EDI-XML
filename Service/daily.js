var jFile = require('jsonfile');
var filePath = './DataDB/daily.json';
var uuidV1 = require('uuid/v1');
var dateFormat = require('dateformat');
var fs = require('fs');
var path = require('path');
var mime = require('mime');


var Daily = {

    DoesXMLExist: function (data, cb) {
        fs.readFile(filePath, function (err, obj) {
            var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
            var jsonData = JSON.parse(ddd);
            rec = jsonData.filter(x => x.records.some(m => m.ID == data.ID && m.Origin == data.Origin && m.Destination == data.Destination && m.TraceCd == data.TraceCd));
            cb(rec.length);
        });

    },

    XMLRecordExistMultiple: function (data, cb) {
        fs.readFile(filePath, function (err, obj) {
           
            var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
            if (obj.toString().trim().length == 0) {
                var TotalRecord = data.length;
                var CurrentRecord = 0;
                data.forEach(function (Item) {
                    CurrentRecord++;
                    Item.IsNew = true;
                    if (TotalRecord == CurrentRecord) {
                        cb(data);
                    }
                });

            } else {
                var jsonData = JSON.parse(ddd);
                var TotalRecord = data.length;
                var CurrentRecord = 0;
                data.forEach(function (Item) {

                    CompareOld(jsonData, Item, function (isneew) {
                        CurrentRecord++;
                        if (isneew == 0)
                            Item.IsNew = true;
                        else
                            Item.IsNew = false;
                        if (TotalRecord == CurrentRecord) {
                            cb(data);
                        }

                    });


                });
            }


        });

    },
    GetDailyByID: function (id, cb) {
        fs.readFile(filePath, function (err, obj) {
            var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
            var jsonData = JSON.parse(ddd);
            rec = jsonData.filter(m => m.id == id)[0];
            cb(rec);
        });
    },
    GetDaily: function (req, res) {
        fs.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
            //  console.log(ddd);
            res.json(JSON.parse(ddd));
        });

    },

    SaveDaily: function (data, fileName, fullname, ClientName, cb) {

        // spoofing the DB response for simplicity

        var Newobj = {
            "id": uuidV1(),
            "receiveTime": dateFormat(Date.now(), "mm/dd/yyyy hh:MM tt"),
            "client": ClientName,
            "fileName": fileName,
            "logFile": fullname,
            "records": data
        };
        // obj.push(Newobj);

        fs.appendFile(filePath, JSON.stringify(Newobj) + ",", function (err) {

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
    },

    download: function (req, res) {

        fs.readFile(filePath, function (err, obj) {
            if (err)

                var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
            var jsonData = JSON.parse(ddd);
            rec = jsonData.filter(m => m.id == req.params.id)[0];
            file = rec.logFile;
            //  console.log(ddd);
            var filename = path.basename(file);
            var mimetype = mime.lookup(file);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(file);
            filestream.pipe(res);


        });

    }
}

module.exports = Daily;

function CompareOld(FullData, data, cb) {
    var TotalRecord = FullData.length;
    var process = 0;
    FullData.forEach(function (item) {

        rec = item.records.filter(m => m.ID == data.ID && m.Origin == data.Origin && m.Destination == data.Destination && m.TraceCd == data.TraceCd);
        process++
        if (rec.length > 0) {
            cb(rec.length);
        }

        if (process == TotalRecord) {
            cb(rec.length);
        }

    });

}