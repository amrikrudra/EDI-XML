var jFile = require('jsonfile');
var filePath = './DataDB/freight.json';
var Freight = {
    GetFreight: function (req, res) {
        jFile.readFile(filePath, function (err, obj) {
            if (err)
                console.log("Error", err);
            res.json(obj)
        });

    },

    SaveFreight: function (req, res) {
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
    DeleteFreight: function (req, res) {
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
    UpdateFreight: function (req, res) {
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
    GetStatusAndLocDB: function (Origin, Destination, Freight, cb) {
        jFile.readFile(filePath, function (err, obj) {
        
        
            index = obj.filter(function (item) {
                return (item.tdirection.toString().toLowerCase() == Destination.toString().toLowerCase() && item.shiptype.toString().toLowerCase() == Origin.toString().toLowerCase() && item.fcode.toString().toLowerCase() == Freight.toString().toLowerCase());
            });
          console.log(index);
            if (index.length > 0)
                cb(index[0]);
                else
                cb(null);

        });
    }

}

module.exports = Freight;