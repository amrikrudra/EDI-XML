var jFile = require('jsonfile');
var filePath = './DataDB/user.json';
var User = {
    GetUser: function (req, res) {
        jFile.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            res.json(obj.filter(m=>m.role!="superadmin"))
        });

    },

    SaveUser: function (req, res) {
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
    DeleteUser: function (req, res) {
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
    UpdateUser: function (req, res) {
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

      ValidateUser: function (req,res) {
           console.log('ValidateUser Data Record', req.body);
        jFile.readFile(filePath, function (err, obj) {
            index = obj.filter(function (item) {
                return (item.userName ==req.body. userName && item.password==req.body.password);
            });
           console.log("RRRR",index);
            if (index.length==0) {
               res.json({"status":false,"user":null})
            } else {
                res.json({"status":true,"user":index[0]});
            }
        });
    }
}

module.exports = User;