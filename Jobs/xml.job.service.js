var Client = require('ftp');
var nodemailer = require('nodemailer');
var fs = require('fs');
var XLSX = require('xlsx');
var uuidV1 = require('uuid/v1');
var FreighService = require('../Service/freight.js');
var CountryService = require('../Service/country.js');



var XMLService = {
    SendEmail:function(){

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

    ReadCountryExcel: function (InputFile, Client, cb) {
        var workbook = XLSX.readFile(InputFile);
        var SheetName = workbook.Props.SheetNames[0];

        var dataRows = [];
        var row = 2;

        while (GetData(workbook, SheetName, "A" + row) != "") {

            try {
                //console.log("Daa",workbook.Sheets.A["Q"+ row])
                dataRows.push({
                    "ID": uuidV1(),
                    "COUNTRY": GetData(workbook, SheetName, "A" + row),
                    "UNCODE": GetData(workbook, SheetName, "B" + row),
                    "LOCNAME": GetData(workbook, SheetName, "C" + row),
                    "SUBDIV": GetData(workbook, SheetName, "D" + row),
                    "IATACODE": GetData(workbook, SheetName, "E" + row),
                    "IATANAME": GetData(workbook, SheetName, "F" + row),
                    "TIMEXONE": GetData(workbook, SheetName, "G" + row),
                    "PORT": GetData(workbook, SheetName, "H" + row),
                    "AIRPORT": GetData(workbook, SheetName, "I" + row),
                    "RAIL": GetData(workbook, SheetName, "J" + row),
                    "ROAD": GetData(workbook, SheetName, "K" + row),
                    "UNSTANDARD": GetData(workbook, SheetName, "L" + row),
                    "LOCALNAME": GetData(workbook, SheetName, "M" + row),
                    "NONIATA": GetData(workbook, SheetName, "N" + row),
                    "VALIDFROM": GetData(workbook, SheetName, "O" + row),
                    "VALIDTO": GetData(workbook, SheetName, "P" + row)

                });
            } catch (ex) {
                console.log(ex);
            }

            row = row + 1;


        }
        console.log("Country DB", dataRows.length);
        cb(dataRows);
    },
    ReadExcel: function (InputFile, Client, cb) {
        var workbook = XLSX.readFile(InputFile);
        var dataRows = [];
        var row = 2;

        var SheetName = workbook.SheetNames[0];
        while (GetData(workbook, SheetName, "A" + row) != "") {
            try {
                //console.log("Daa",workbook.Sheets.A["Q"+ row])
                dataRows.push({
                    "ID": GetData(workbook, SheetName, "A" + row),
                    "Origin": GetData(workbook, SheetName, "B" + row),
                    "Destination": GetData(workbook, SheetName, "C" + row),
                    "BOL": GetData(workbook, SheetName, "D" + row),
                    "PO": GetData(workbook, SheetName, "E" + row),
                    "TraceCd": GetData(workbook, SheetName, "F" + row),
                    "Freight": GetData(workbook, SheetName, "G" + row),
                    "Finance": GetData(workbook, SheetName, "H" + row),
                    "Status": GetData(workbook, SheetName, "I" + row),
                    "Customer": GetData(workbook, SheetName, "J" + row),
                    "Shipper": GetData(workbook, SheetName, "K" + row),
                    "Consignee": GetData(workbook, SheetName, "L" + row),
                    "Note": GetData(workbook, SheetName, "M" + row),
                    "ContainerNumber": GetData(workbook, SheetName, "N" + row),
                    "OriginZone": GetData(workbook, SheetName, "O" + row),
                    "DestinationZone": GetData(workbook, SheetName, "P" + row),
                    "Date": GetData(workbook, SheetName, "Q" + row),
                    "Time": GetData(workbook, SheetName, "R" + row),
                    "UNCODE": GetData(workbook, SheetName, "S" + row),
                    "Client": Client
                });
            } catch (ex) {}

            row = row + 1;


        }
        cb(dataRows);
    },
    CreateXML: function (JsonData, Client, isuFile, cb) {
      
        var interXML = "";
        var TotalRecord = JsonData.length;
        var Processed = 0;
        var logData = [];


        JsonData.forEach(function (item) {
            FreighService.GetStatusAndLocDB(item.OriginZone, item.DestinationZone, item.Freight, function (data) {
               
                var country = "CA";
                var locName;
                var subdiv;
                if (data != null) {
                    //if (data.length > 0) {
                        if (data.floc.toString().toLowerCase() == "origin") {
                            locName = item.Origin.split(',')[0].trim();
                            subdiv = item.Origin.split(',')[1].trim();
                        } else {
                            locName = item.Destination.split(',')[0].trim();
                            subdiv = item.Destination.split(',')[1].trim();
                        }

                        CountryService.GetUnCode(country, locName, subdiv, function (unCode) {
                            Processed++;
                            if (unCode == null) {
                                unCode={};
                                unCode.COUNTRY = "CA";
                                unCode.UNCODE = "";
                            }
                         

                            if (isuFile == false) {
                                  if(item.IsNew){
                                interXML += "<Scp_edistatusqueue><messagesdr>" + Client + "</messagesdr>" +
                                    "<shipnum>" + item.PO + "</shipnum> " +
                                    "<statuscd>" + data.scode + "</statuscd>" +
                                    "<statusdt>" + item.Date + " " + item.Time + "</statusdt>" +
                                    "<stsloccd>" + unCode.COUNTRY + unCode.UNCODE + "</stsloccd></Scp_edistatusqueue>";
                                  }
                                logData.push({
                                    "messagesdr": Client,
                                    "shipnum": item.PO,
                                    "statuscd": data.scode,
                                    "statusdt": item.Date + " " + item.Time,
                                    "stsloccd": unCode.COUNTRY + unCode.UNCODE,
                                    "ufileid": "",
                                    "contno": "",
                                    "IsNew": item.IsNew
                                });
                            } else {
                                  if(item.IsNew){
                                interXML += "<Scp_edistatusqueue><messagesdr>" + Client + "</messagesdr>" +
                                    "<ufileid>" + item.PO + "</ufileid><contno>" + item.TraceCd + "</contno>" +
                                    "<statuscd>" + data.scode + "</statuscd>" +
                                    "<statusdt>" + item.Date + " " + item.Time + "</statusdt>" +
                                    "<stsloccd>" + unCode.COUNTRY + unCode.UNCODE + "</stsloccd></Scp_edistatusqueue>";
                                  }
                                logData.push({
                                    "messagesdr": Client,
                                    "shipnum": "",
                                    "statuscd": data.scode,
                                    "statusdt": item.Date + " " + item.Time,
                                    "stsloccd": unCode.COUNTRY + unCode.UNCODE,
                                    "ufileid": item.PO,
                                    "contno": item.TraceCd,
                                    "IsNew": item.IsNew
                                });
                            }

                            if (Processed == TotalRecord)
                               if(interXML=="")
                               {
                                   cb({
                                    "xml":  interXML ,
                                    "log": logData,
                                    "msg":"No  new record found"
                                });
                               }
                               else
                               {
                                cb({
                                    "xml":  interXML ,
                                    "log": logData,
                                    "msg":""
                                });
                               }
                        }); // UnCode
                    } else {
                        Processed++;
                        if (Processed == TotalRecord)
                             cb({
                               "xml":"",
                                "log": [],
                                "msg":"Unable to find statloccd or statuscd"
                            });
                             // "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?> <scp_edistatusqueue>" + interXML + "</scp_edistatusqueue>",
                      

                   // }
                }
            });
            
        });

    },
    UploadToFtp(Host, userName, Password, fileName, content, cb) {
      
        var c = new Client();
        c.on('ready', function () {
            c.put(content, fileName, function (err) {
                if (err) console.log("ftp error"+ err);
                c.end();
                cb("ok");
            });
        });
        c.on('error', function () {
             console.log("ftp error");
             cb("error");
             
        });
        // connect to localhost:21 as anonymous 
        c.connect({
            user: userName,
            password: Password
        });

    }
}

function GetData(obj, SheetName, col) {
    try {
        return obj.Sheets[SheetName][col].w; //obj.Sheets[SheetName][col].w;
    } catch (ex) {
        return "";
    }
}

module.exports = XMLService;