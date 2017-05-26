// jobs.js 
var setting = require('../Service/setting.js');
var Daily = require('../Service/daily.js');
var CountryDB = require('../Service/country.js');
var XML = require('../Service/xmllog.js');
var XMLService = require('./xml.job.service.js');
var path = require('path');
var nodemailer = require('nodemailer');
var dateFormat = require('dateformat');
var fs = require('fs');
exports.CheckNewFiles = {

    after: { // Configuring this job to run after this period. 
        seconds: 10,
        minutes: 0,
        hours: 0,
        days: 0
    },
    job: function () {
        // Get All Active Setting 
        setting.GetActiveSetting(function (data) {
            // loop through all the setting  and Read Data for Source Location
            try {
                if (data.length > 0)
                    CallSettingOneByOne(data, 0);
                /* data.forEach(function (Setting) {
                     var SourceFile = Setting.sourceFile + "\\PAFCL.xls";
                     var SourceFileShip = Setting.sourceFile + "\\PALCL.xls";

                     ProcessFile(SourceFile, Setting, "f", function () {
                         ProcessFile(SourceFileShip, Setting, "h", function () {
                             console.log("Data Base Updated");
                         }); // helf  
                     }); //full 


                 });*/
            } catch (ex) {
                console.log("Error", ex);
            }



        });




    },
    spawn: true
}

exports.PurgeArchiveData = {

    after: { // Configuring this job to run after this period. 
        seconds: 0,
        minutes: 1,
        hours: 0,
        days: 0
    }, // Cron tab instruction. 
    job: function () {
        console.log("PurgeArchiveData");
    },
    spawn: false // If false, the job will not run in a separate process. 
}

exports.CountryExcel = {

    after: { // Configuring this job to run after this period. 
        seconds: 10,
        minutes: 0,
        hours: 0,
        days: 0
    }, // Cron tab instruction. 
    job: function () {



        ProcessCountryExcel();

    },
    spawn: false // If false, the job will not run in a separate process. 
}


function RemoveAll(data, item) {
    for (var i = data.length - 1; i--;) {
        if (data[i].PO === item) data.splice(i, 1);
    }
    return data;
}



function ProcessCountryExcel(Data, SettingIndex) {
    var basePath = __dirname.replace("jobs", "DataDB");
    var SourceFile = basePath + "\\CountryDB.xls";
    //   console.log("Source File Path", SourceFile);
    if (fs.existsSync(SourceFile)) {
        XMLService.ReadCountryExcel(SourceFile, "Dummay", function (excelData) {

            fs.renameSync(SourceFile, basePath + "\\CountryDB_.xls");
            CountryDB.SaveCountry(excelData, "", "", function () {

            }); // Country Save
        }); // Country Read Excel Data
    }
}


function CallSettingOneByOne(Data, SettingIndex) {
    var Setting = Data[SettingIndex];
    var SourceFile = Setting.sourceFile + "\\" + Setting.fullFileName;
    var SourceFileShip = Setting.sourceFile + "\\" + Setting.halfFileName;

    ProcessFile(SourceFile, Setting, "f", function () {
        ProcessFile(SourceFileShip, Setting, "h", function (data) {
            console.log("Data Base Updated");
            SettingIndex++;
            if (Data[SettingIndex] != undefined)
                CallSettingOneByOne(Data, SettingIndex);

        }); // helf  
    }); //full

}

function GetXMLFileName(Setting, fileobj) {
    var FileName = "";
    if (Setting.fullFileName == fileobj.base) {
        if (Setting.combinefullFile == "") {
            FileName = fileobj.name + "_" + dateFormat(Date.now(), 'yyyymmddhhMM') + ".xml";
        } else {
            FileName = path.parse(Setting.combinefullFile).base + "_" + dateFormat(Date.now(), 'yyyymmddhhMM') + ".xml";
        }
    } else {
        if (Setting.combinehalfFile == "") {
            FileName = fileobj.name + "_" + dateFormat(Date.now(), 'yyyymmddhhMM') + ".xml";
        } else {
            FileName = path.parse(Setting.combinehalfFile).base + "_" + dateFormat(Date.now(), 'yyyymmddhhMM') + ".xml";
        }
    }

    console.log("File name", FileName);
    return FileName;
}

function ProcessFile(SourceFile, Setting, type, cb) {
    if (fs.existsSync(SourceFile)) {
        console.log("Starting");
        XMLService.ReadExcel(SourceFile, Setting.clientName, function (ExcelJson) {
            console.log("Read Excel");
            var fData = path.parse(SourceFile);
            Daily.XMLRecordExistMultiple(ExcelJson, function (JsonRecord) {
                console.log("Compare");
                XMLService.GroupByJsonData(JsonRecord, function (GRecord) {


                    var TotalGRecord = GRecord.length;
                    var ProcessGRecord = 0;
                    var CombineXML = "";
                    var CombineLog = [];
                    var xmlCol = [];
                    // console.log("GRecod out Foreach");
                    GRecord.forEach(function (Record) {
                        console.log("GRecod in Foreach");
                        XMLService.CreateXML(Record.Records, Setting.clientName, type == "f" ? true : false, function (xmlData) {
                            //   console.log("XML Creation");
                            batchNumber= Date.now();
                            ProcessGRecord++;
                            //  console.log("Total ProcessGRecord " +ProcessGRecord,TotalGRecord);
                            CombineXML += xmlData.xml;
                            xmlData.ID = Record.ID;
                            xmlCol.push(xmlData);
                            CombineLog.concat(xmlData.log);
                            if (TotalGRecord == ProcessGRecord) // Upload 
                            {
                                console.log("Entererererererer r erer er er ", xmlCol.filter(m => m.xml.length == 0).length);
                                if (xmlCol.filter(m => m.xml.length == 0).length > 0) {
                                    if (fs.existsSync(SourceFile))
                                        fs.unlinkSync(SourceFile);
                                    // Send Error Email Stating that there is error in Source file unable to process.
                                    var msg = "Hi,\n\n";
                                    msg += " The file " + fData.base + " has found following error:\n\n";
                                    msg += " Error: "+ xmlData.msg +"\n\n";
                                    msg += "\nFile process action is aborted. \n";
                                    msg += "Correct the error in the file or recreate the file \n";
                                    msg += "Drop the file at Source location : " + Setting.sourceFile + " \n";
                                    msg += "\nEDI-XML Team \n";

                                    msg += "RS RUSH \n";
                                    SendLogEmail(Setting.userEmail, "XML files Processing error :" + dateFormat(Date.now(), 'yyyy-mm-dd hh:MM'), msg);
                                    cb("Done With Errors");

                                } else {
                                    if (Setting.combineXML == "Yes") {
                                        FileName = GetXMLFileName(Setting, fData);
                                        var XMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?> <scp_edistatusqueue>" + CombineXML + "</scp_edistatusqueue>";
                                        XMLService.UploadToFtp(Setting.serverName, Setting.userName, Setting.password, Setting.endPoint + "/" + FileName, XMLString, function (ftpInfo) {
                                            var DailyArchive = Setting.dailyLog + "\\" + fData.name + "_" + dateFormat(Date.now(), "yyyymmddhhMM") + fData.ext;
                                            fs.renameSync(SourceFile, DailyArchive); // Daily Archiving
                                            Daily.SaveDaily(ExcelJson, fData.base, DailyArchive, Setting.clientName, function () {
                                                var ShipmentNumber = Setting.xmlFile + "\\" + FileName;
                                                fs.appendFileSync(ShipmentNumber, XMLString); // Archiving XML file
                                                if (Setting.sendEmail === "1") {
                                                    var msg = "Hi,\n\n";
                                                    msg += " Incoming file :" + fData.base + "\n\n";
                                                    msg += " The following XMLs has been send send successfully:\n\n";
                                                    msg += FileName + "  " + ftpInfo + "\n\n";
                                                    msg += "\nFor complete history or more details : http://35.162.147.238:83 \n";
                                                    msg += "\nEDI-XML Team \n";
                                                    msg += "RS RUSH \n";
                                                    SendLogEmail(Setting.clientEmail + "," + Setting.userEmail, "XML files (" + xmlCol.length + ") Successfilly send :" + dateFormat(Date.now(), 'yyyy-mm-dd hh:MM'), msg);
                                                }
                                                XML.SaveXmlLog(xmlData.log, FileName, ShipmentNumber, Setting.id,batchNumber, Setting.clientName, function (data) {
                                                    //    console.log("Saved XML ", FileName);
                                                    cb("Done");
                                                });

                                            }); // Save Daily Reacords
                                        }); // ftp Upload
                                    } // Combine End
                                    else {
                                        console.log("Single File");
                                        var TotalS = xmlCol.length;
                                        var PS = 0;
                                        var FileNames = "";
                                        xmlCol.forEach(function (Item) {
                                            var FileName = Item.ID + "_" + dateFormat(Date.now(), 'yyyymmddhhMM') + ".xml";
                                            var XMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?> <scp_edistatusqueue>" + Item.xml + "</scp_edistatusqueue>";
                                            XMLService.UploadToFtp(Setting.serverName, Setting.userName, Setting.password, Setting.endPoint + "/" + FileName, XMLString, function (ftpInfo) {
                                                var DailyArchive = Setting.dailyLog + "\\" + fData.name + "_" + dateFormat(Date.now(), "yyyymmddhhMM") + fData.ext;
                                                fs.renameSync(SourceFile, DailyArchive); // Daily Archiving
                                                Daily.SaveDaily(ExcelJson, fData.base, DailyArchive, Setting.clientName, function () {
                                                    var ShipmentNumber = Setting.xmlFile + "\\" + FileName;
                                                    fs.appendFileSync(ShipmentNumber, XMLString); // Archiving XML file
                                                    if (Setting.sendEmail === "1") {
                                                        var msg = "Hi,\n\n";
                                                        msg += " Incoming file :" + fData.base + "\n\n";
                                                        msg += " The following XMLs has been send send successfully:\n\n";
                                                        msg += FileName + "  " + ftpInfo + "\n\n";
                                                        msg += "\nFor complete history or more details : http://35.162.147.238:83 \n";
                                                        msg += "\nEDI-XML Team \n";
                                                        msg += "RS RUSH \n";
                                                        SendLogEmail(Setting.clientEmail + "," + Setting.userEmail, "XML files (" + xmlCol.length + ") Successfilly send :" + dateFormat(Date.now(), 'yyyy-mm-dd hh:MM'), msg);
                                                    }
                                                    XML.SaveXmlLog(xmlData.log, FileName, ShipmentNumber, Setting.id, batchNumber, Setting.clientName, function (data) {
                                                        //    console.log("Saved XML ", FileName);
                                                        if (TotalS == PS)
                                                            cb("Done");
                                                    });

                                                }); // Save Daily Reacords
                                            }); // ftp Upload

                                        })
                                    }

                                } // Let Process All Records
                            }




                        }); // Create XML
                    }); // Group Data One By One

                }); // Group By PO

            }) // Reach IsNew Multiple





        }); // Read Exl


    } else {
        cb("data");
    }
}





function SendLogEmail(to, subject, body) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'amrik@rudrainnovatives.com',
            pass: 'Singh@rudra'
        }
    });

    var mailOptions = {
        from: "info@rudrainnovatives.com",
        to: to,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}