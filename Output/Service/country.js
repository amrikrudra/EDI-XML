var jFile = require('jsonfile');
var filePath = './DataDB/country.code.json';
var uuidV1 = require('uuid/v1');
var dateFormat = require('dateformat');
var XLSX = require('xlsx');
var fs = require('fs');
var path = require('path');
var mime = require('mime');


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
        str = str.substr(1, str.length - 2);
        fs.writeFile(filePath, str + ",", function (err) {
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
    GetUnCode: function (COUNTRY, LOCNAME, SUBDIV, cb) {

        fs.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            var ddd = JSON.parse("[" + obj.toString().substr(0, obj.toString().length - 1) + "]");

            var res = index = ddd.filter(function (item) {
                return (item.COUNTRY.toString().toLowerCase() == COUNTRY.toString().toLowerCase() && item.LOCNAME.toString().toLowerCase() == LOCNAME.toString().toLowerCase() && item.SUBDIV.toString().toLowerCase() == SUBDIV.toString().toLowerCase());
            });

            if (res.length > 0)
                cb(res[0]);
            else
                cb(null);
        });
    },
    ProcessCountryExcel: function () {
        var basePath = __dirname.replace("SERVICE", "DataDB");
        console.log("base path", basePath);
        var SourceFile = basePath + "\\CountryDB.xls";
        console.log("Process Filem", SourceFile);
        //   console.log("Source File Path", SourceFile);
        if (fs.existsSync(SourceFile)) {
            console.log("Yes Exist");
            ReadCountryExcel(SourceFile, "Dummay", function (excelData) {

                fs.renameSync(SourceFile, basePath + "\\CountryDB_.xls");
                CountryDB.SaveCountry(excelData, "", "", function () {

                }); // Country Save
            }); // Country Read Excel Data
        }
    },
    download: function (req, res) {

        fs.readFile(filePath, function (err, obj) {
            if (err)
                var ddd = "[" + obj.toString().substr(0, obj.toString().length - 1) + "]";
            var basePath = __dirname.replace("Service", "DataDB");
            var SourceFile = basePath + "\\CountryDB.xls";

            file = SourceFile;
            console.log(SourceFile);
            if (fs.existsSync(SourceFile)) {
                var filename = path.basename(file);
                var mimetype = mime.lookup(file);

                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype);

                var filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }


        });

    }

}

module.exports = CountryDB;


function ReadCountryExcel(InputFile, Client, cb) {
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
}

function GetData(obj, SheetName, col) {
    try {
        return obj.Sheets[SheetName][col].w; //obj.Sheets[SheetName][col].w;
    } catch (ex) {
        return "";
    }
}