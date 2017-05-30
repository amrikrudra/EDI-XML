var jFile = require('jsonfile');
var fs = require('fs');
var filePath = './DataDB/xmllog.json';
var uuidV1 = require('uuid/v1');
var dateFormat = require('dateformat');
var moment = require('moment');
var path = require('path');
var mime = require('mime');
var Setting = require('./setting.js');
var Job = require('../Jobs/xml.job.service.js');

var XmlLog = {



        GetXMLByID: function (id, cb) {
            fs.readFile(filePath, function (err, obj) {
                var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
                var jsonData = JSON.parse(ddd);
                rec = jsonData.filter(m => m.id == id)[0];
                cb(rec);
            });
        },

        GetXMLByBatchID: function (id, cb) {
            fs.readFile(filePath, function (err, obj) {
                var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
                var jsonData = JSON.parse(ddd);
                rec = jsonData.filter(m => m.batchid == id);
                cb(rec);
            });
        },
        GetXmlLog: function (req, res) {
            fs.readFile(filePath, function (err, obj) {
                if (err)
                    console.log("Error", err);
                var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
                console.log(JSON.parse(ddd));
                res.json(JSON.parse(ddd));
            });

        },
        GetArchiveRecord: function (date, cb) {
            fs.readFile(filePath, function (err, obj) {
                if (obj.toString().length > 0) {
                    var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
                    var jsonData = JSON.parse(ddd);
                    rec = jsonData.filter(m => m.created <= date);
                    cb(rec);
                } else {
                    cb([]);
                }
            });
        },
        DeleteAndUpdate: function (DeleteSet, cb) {
            fs.readFile(filePath, function (err, obj) {
                        if (obj.toString().length > 0) {
                            var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
                            var jsonData = JSON.parse(ddd);
                            DeleteSet.forEach(function (Item) {
                                // console.log("Founded",jsonData.indexOf( jsonData.filter(i=>i.id==Item.id)[0]));
                                jsonData.splice(jsonData.indexOf(jsonData.filter(i => i.id == Item.id)[0]), 1);
                            });
                            datatoSave = JSON.stringify(jsonData);
                            datatoSave = datatoSave.substr(1, datatoSave.length - 2)+",";
                            fs.writeFile(filePath, datatoSave, function (err, obj) {
                                    cb("done");
                                });
                        }
                            else {
                                cb("done");
                            }
                        });
                },
                SaveXmlLog: function (data, fileName, fullName, settingid, batchid, ClientName, cb) {

                    // spoofing the DB response for simplicity
                    //    fs.appendFile(filePath,obj, function (err, obj) {
                    var Newobj = {
                        "id": uuidV1(),
                        "receiveTime": dateFormat(Date.now(), "yyyy-mm-dd hh:MM:ss tt"),
                        "created": moment().format('X'),
                        "client": ClientName,
                        "fileName": fileName,
                        "logFile": fullName,
                        "settingid": settingid,
                        "batchid": batchid,
                        "records": data
                    };
                    //     obj.push(Newobj);

                    fs.appendFile(filePath, JSON.stringify(Newobj) + ",", function (err) {


                        cb("{\"Status\":\"OK\"}");
                    });
                    //  });

                },
                DeleteXmlLog: function (req, res) {
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
                UpdateXmlLog: function (req, res) {
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

                },
                resend: function (req, res) {
                    XmlLog.GetXMLByID(req.params.id, function (XRec) {
                        Setting.GetSettingByID(XRec.settingid, function (Settings) {
                            fs.readFile(XRec.logFile, function (err, data) {
                                Job.UploadToFtp(Settings.serverName, Settings.userName, Settings.password, Settings.endPoint + "/" + XRec.fileName, data.toString(), function (err) {
                                    if (err == "ok")
                                        res.json({
                                            "status": "OK"
                                        });
                                    else

                                        res.json({
                                            "status": "Error" + err
                                        });

                                });
                            });

                        });
                    });

                },
                resendb: function (req, res) {
                    XmlLog.GetXMLByID(req.params.id, function (XRec) {
                        Setting.GetSettingByID(XRec.settingid, function (Settings) {
                            XmlLog.GetXMLByBatchID(XRec.batchid, function (BRec) {
                                BRec.forEach(function (element) {
                                    console.log("Batch Send", element.fileName);
                                    fs.readFile(element.logFile, function (err, data) {
                                        Job.UploadToFtp(Settings.serverName, Settings.userName, Settings.password, Settings.endPoint + "/" + element.fileName, data.toString(), function (err) {
                                            if (err == "ok")
                                                res.json({
                                                    "status": "OK"
                                                });
                                            else

                                                res.json({
                                                    "status": "Error" + err
                                                });

                                        });
                                    });
                                });
                            });

                        });
                    });

                }
        }

        module.exports = XmlLog;