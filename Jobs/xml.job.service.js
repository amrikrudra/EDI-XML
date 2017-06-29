var Client = require('ftp');
var nodemailer = require('nodemailer');
var fs = require('fs');
var XLSX = require('xlsx');
var uuidV1 = require('uuid/v1');
var FreighService = require('../Service/freight.js');
var CountryService = require('../Service/country.js');
var config = require('config');
var moment = require('moment');

var XMLService = {
    SendEmail: function () {

    },
    GroupByJsonData: function (InputData, cb) {
        var GroupData = [];
        InputData.forEach(function (Item) {
            var HaveItem = [];
            if (GroupData.length > 0)
                HaveItem = GroupData.filter(m => m.ID == Item.PO);
            else
                HaveItem = [];

            if (HaveItem.length == 0) {
                GroupData.push({
                    "ID": Item.PO,
                    "Records": InputData.filter(m => m.PO == Item.PO)
                });
            }

        });
        // console.log("G Data", GroupData);
        cb(GroupData);
    },


    ReadExcel: function (InputFile, Client, cb) {
        var workbook = XLSX.readFile(InputFile);
        var dataRows = [];
        var row = 2;

        var SheetName = workbook.SheetNames[0];
        while (GetData(workbook, SheetName, "A" + row) != "") {
            try {
                //console.log("Daa",workbook.Sheets.A["Q"+ row])
             dataRows.push(  {
                    "ID": GetData(workbook, SheetName, "A" + row),
                    "Origin": GetData(workbook, SheetName, "B" + row),
                    "Destination": GetData(workbook, SheetName, "C" + row),
                    "BOL": GetData(workbook, SheetName, "D" + row),
                    "PO": GetData(workbook, SheetName, "E" + row),
                    "TraceCd": GetData(workbook, SheetName, "F" + row),
                    "Freight": GetData(workbook, SheetName, "G" + row),
                    "Finance": GetData(workbook, SheetName, "H" + row),
                    "ShipType": GetData(workbook, SheetName, "I" + row),
                    "Customer": GetData(workbook, SheetName, "J" + row),
                    "Shipper": GetData(workbook, SheetName, "K" + row),
                    "Consignee": GetData(workbook, SheetName, "L" + row),
                    "Note": GetData(workbook, SheetName, "M" + row),
                    "ContainerNumber": GetData(workbook, SheetName, "N" + row),
                    "TType": GetData(workbook, SheetName, "O" + row),
                    "TDirection": GetData(workbook, SheetName, "P" + row),
                    "Date": GetData(workbook, SheetName, "Q" + row),
                    "Time": GetData(workbook, SheetName, "R" + row),
                    "UNCODE": GetData(workbook, SheetName, "S" + row),
                    "Client": Client,
                    "RecordNo": row,
                    "Error": false,
                    "ErrorMsg": ""
                });
                
               
               // dataRows.push(row);

            } catch (ex) {}

            row = row + 1;


        }
        console.log("Total Excel Reocrds",dataRows);
        cb(dataRows);
    },
    CreateXML: function (JsonData, Client, isuFile, cb) {
        var interXML = "";
        var TotalRecord = JsonData.length;
        var Processed = 0;
        var logData = [];
        var Application = config.get("Application");

           JsonData.forEach(function (item) 
           {
       // for (i = 0; i < JsonData.length; i++) {
      //      item = JsonData[i];
            FreighService.GetStatusAndLocDB(item.TType, item.TDirection, item.Freight, item.ShipType, function (data) {


                //console.log("Date", moment(new Date(item.Date)).format("YYYY-MM-DD"));
                var country = "CA";
                var locName;
                var subdiv;
                if (data != null) {
                    //if (data.length > 0) {
                    if (data.floc.toString().toLowerCase() == "origin") {
                        if (item.Origin.split(',').length > 0) {

                            locName = item.Origin.split(',')[0].trim();
                            subdiv = item.Origin.split(',')[1].trim();
                        } else {
                            locName = item.Origin.toString().trim();
                            subdiv = ""; //item.Origin.split(',')[1].trim();
                        }
                    } else {

                        if (item.Destination.split(',').length > 0) {

                            locName = item.Destination.split(',')[0].trim();
                            subdiv = item.Destination.split(',')[1].trim();
                        } else {
                            locName = item.Destination.toString().trim();
                            subdiv = ""; //item.Origin.split(',')[1].trim();
                        }
                    }

                    CountryService.GetUnCode(country, locName, subdiv, function (unCode) {

                        if (unCode == null) {
                            Processed++;
                            unCode = {};
                            unCode.COUNTRY = "CA";
                            unCode.UNCODE = "";

                            /* cb({
                                 "xml": "",
                                 "log": [],
                                 "msg": "Unable to find  stsloccd"
                             });*/
                            item.Error = true;
                            item.ErrorMsg = "Unable to find  stsloccd";

                           // console.log("processed %d  Total %d", Processed, TotalRecord, item);
                            if (Processed == TotalRecord) {
                                if (interXML == "") {

                                    cb({
                                        "xml": interXML,
                                        "log": logData,
                                        "msg": "No  new record found"
                                    });
                                } else {
                                    cb({
                                        "xml": interXML,
                                        "log": logData,
                                        "msg": ""
                                    });
                                }
                            }
                        } else {
                            Processed++;

                            if (isuFile == false) {
                                if (item.IsNew) {
                                    interXML += "<Scp_edistatusqueue><messagesdr>" + Application.OwnerName + "</messagesdr>" +
                                        "<shipnum>" + item.PO + "</shipnum> " +
                                        "<statuscd>" + data.scode + "</statuscd>" +
                                        "<statusdt>" + moment(new Date(item.Date)).format("YYYY-MM-DD") + " " + item.Time + "</statusdt>" +
                                        "<stsloccd>" + unCode.COUNTRY + unCode.UNCODE + "</stsloccd></Scp_edistatusqueue>";
                                }
                                logData.push({
                                    "messagesdr": Application.OwnerName,
                                    "shipnum": item.PO,
                                    "statuscd": data.scode,
                                    "statusdt": moment(new Date(item.Date)).format("YYYY-MM-DD") + " " + item.Time,
                                    "stsloccd": unCode.COUNTRY + unCode.UNCODE,
                                    "ufileid": "",
                                    "contno": "",
                                    "IsNew": item.IsNew
                                });
                            } else {
                                if (item.IsNew) {
                                    interXML += "<Scp_edistatusqueue><messagesdr>" + Application.OwnerName + "</messagesdr>" +
                                        "<ufileid>" + item.PO + "</ufileid><contno>" + item.TraceCd + "</contno>" +
                                        "<statuscd>" + data.scode + "</statuscd>" +
                                        "<statusdt>" + moment(new Date(item.Date)).format("YYYY-MM-DD") + " " + item.Time + "</statusdt>" +
                                        "<stsloccd>" + unCode.COUNTRY + unCode.UNCODE + "</stsloccd></Scp_edistatusqueue>";
                                    logData.push({
                                        "messagesdr": Application.OwnerName,
                                        "shipnum": "",
                                        "statuscd": data.scode,
                                        "statusdt": moment(new Date(item.Date)).format("YYYY-MM-DD") + " " + item.Time,
                                        "stsloccd": unCode.COUNTRY + unCode.UNCODE,
                                        "ufileid": item.PO,
                                        "contno": item.TraceCd,
                                        "IsNew": item.IsNew
                                    });
                                }

                            }

                           // console.log("processed %d  Total %d", Processed, TotalRecord, item);
                            if (Processed == TotalRecord) {
                                if (interXML == "") {

                                    cb({
                                        "xml": interXML,
                                        "log": logData,
                                        "msg": "No  new record found"
                                    });
                                } else {
                                    cb({
                                        "xml": interXML,
                                        "log": logData,
                                        "msg": ""
                                    });
                                }
                            }
                        }


                    }); // UnCode
                } else {

                    Processed++;
                    item.Error = true;
                    item.ErrorMsg = "Unable to find  statuscd";
                    /* cb({
                         "xml": "",
                         "log": [],
                         "msg": "Unable to find  statuscd"
                     });
                     return;*/
                    console.log("processed %d  Total %d", Processed, TotalRecord, item);
                    if (Processed == TotalRecord) {
                        if (interXML == "") {

                            cb({
                                "xml": interXML,
                                "log": logData,
                                "msg": "No  new record found"
                            });
                        } else {
                            cb({
                                "xml": interXML,
                                "log": logData,
                                "msg": ""
                            });
                        }
                    }

                }



            });


        });

    },
    UploadToFtp(Host, userName, Password, fileName, content, cb) {

        var c = new Client();
        c.on('ready', function () {
            c.put(content, fileName, function (err) {
                if (err) console.log("ftp error" + err);
                c.end();
                cb("ok");
            });
        });
        c.on('error', function (err) {
            console.log("ftp error", err);
            cb("error unable to connect to ftp server");

        });
        // connect to localhost:21 as anonymous 
        c.connect({
            host: Host,
            user: userName,
            password: Password
        });

    }
}

function GetData(obj, SheetName, col) {
    try {
        if(col.toString().indexOf('R')==0)
        return moment(new Date("2017-10-10 "+obj.Sheets[SheetName][col].w.trim())).format("HH:mm:ss");
        else
        return obj.Sheets[SheetName][col].w; //obj.Sheets[SheetName][col].w;
    } catch (ex) {
        return "";
    }
}

module.exports = XMLService;