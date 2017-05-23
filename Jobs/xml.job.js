// jobs.js 
var setting = require('../Service/setting.js');
var Daily = require('../Service/daily.js');
var CountryDB = require('../Service/country.js');
var XML = require('../Service/xmllog.js');
var XMLService = require('./xml.job.service.js');
var path = require('path');
var dateFormat = require('dateformat');
var fs = require('fs');
exports.CheckNewFiles = {

    after: { // Configuring this job to run after this period. 
        seconds: 1,
        minutes: 10,
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
        minutes: 10,
        hours: 0,
        days: 0
    }, // Cron tab instruction. 
    job: function () {
        setting.GetActiveSetting(function (data) {
            // loop through all the setting  and Read Data for Source Location
            try {
                if (data.length > 0)
                    ProcessCountryExcel(data, 0);
             
            } catch (ex) {
                console.log("Error", ex);
            }



        });
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
    var Setting = Data[SettingIndex];
    var SourceFile = Setting.sourceFile + "\\CountryDB.xls";
    if (fs.existsSync(SourceFile)) {
        XMLService.ReadCountryExcel(SourceFile, "Dummay", function (excelData) {
            fs.renameSync(SourceFile, Setting.dailyLog + "\\CountryDB_" + dateFormat(Date.now(), "yyyymmddhhMM") + ".xls");
            CountryDB.SaveCountry(excelData, "", "", function () {
                   SettingIndex++;
                if (Data[SettingIndex] != undefined)
                    ProcessCountryExcel(Data, SettingIndex);
            }); // Country Save
        }); // Country Read Excel Data
    }

}


function CallSettingOneByOne(Data, SettingIndex) {
    var Setting = Data[SettingIndex];
    var SourceFile = Setting.sourceFile + "\\PAFCL.xls";
    var SourceFileShip = Setting.sourceFile + "\\PALCL.xls";

    ProcessFile(SourceFile, Setting, "f", function () {
        ProcessFile(SourceFileShip, Setting, "h", function (data) {
            console.log("Data Base Updated");
            SettingIndex++;
            if (Data[SettingIndex] != undefined)
                CallSettingOneByOne(Data, SettingIndex);

        }); // helf  
    }); //full

}

function ProcessFile(SourceFile, Setting, type, cb) {
    if (fs.existsSync(SourceFile)) {
        XMLService.ReadExcel(SourceFile, Setting.clientName, function (ExcelJson) {

            var pFile;
            if (type == "f")
                pFile = "PAFCL";
            else
                pFile = "PALCL";
            // Move File to Archive Folder
            fs.renameSync(SourceFile, Setting.dailyLog + "\\" + pFile + "_" + dateFormat(Date.now(), "yyyymmddhhMM") + ".xls");
            // Write to DB


            Daily.SaveDaily(ExcelJson, pFile + ".xls", Setting.clientName, function (data) {




                // Create XML Process
                XMLService.GroupByJsonData(ExcelJson, function (GRecord) {
                    var TotalRecord = GRecord.length;
                    var ProcessRecord = 0;
                
                    GRecord.forEach(function (Record) {
                        ProcessRecord++;
                        //  var uRecord = ExcelJson.filter(m => m.PO == Record.PO); // Get All Record for same PO
                        //  ExcelJson = RemoveAll(ExcelJson, Record.PO); // Remove from ExcelJson Prcess Records

                        XMLService.CreateXML(Record.Records, Setting.clientName, type == "f" ? true : false, function (xmlData) {
                            var FileName = Record.ID + "_" + dateFormat(Date.now(), 'yyyymmddhhMM') + ".xml";
                            var ShipmentNumber = Setting.xmlFile + "\\" + FileName;
                            fs.appendFileSync(ShipmentNumber, xmlData.xml); // Archiving XML file
                            XMLService.UploadToFtp(Setting.serverName, Setting.userName, Setting.password, Setting.endPoint + "/" + FileName, xmlData.xml, function (ftpInfo) {

                                XML.SaveXmlLog(xmlData.log, FileName, Setting.clientName, function () {
                                    if (ProcessRecord == TotalRecord) {
                                        cb("data");
                                    }

                                });


                            })

                        });


                    }); // ExcelJson for Each

                }); // Group By Close

            }); // Save Fuction End
        });


    } else {
        cb("data");
    }
}