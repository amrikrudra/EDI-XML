var jFile = require('jsonfile');
var filePath = './DataDB/setting.json';
var Setting = {
    GetSettingByID:function(id,cb){
          jFile.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Setting Error", err);
           cb(obj.filter(m => m.id == id)[0]);
        });
    },
    GetSetting: function (req, res) {
        jFile.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            res.json(obj)
        });

    },

    SaveSetting: function (req, res) {
        console.log("Data ", req.body)
        // spoofing the DB response for simplicity
        jFile.readFile(filePath, function (err, obj) {
            obj.push(req.body);
            jFile.writeFile(filePath, obj, {

            }, function (err) {
                console.error("rror", err);
                if (err == null)
                    res.json(obj);
            });
        });

    },
    DeleteSetting: function (req, res) {
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
    UpdateSetting: function (req, res) {
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
     GetActiveSetting: function (cb) {
        jFile.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            return  cb(obj.filter(m=>m.status=="Active"));
        });

    }
}

module.exports = Setting;