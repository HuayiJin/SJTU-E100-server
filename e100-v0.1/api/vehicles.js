var db = require("./db");
var sqlquery = require('./sqlquery');
var safetycheck = require('./safetycheck');

/**
 * 查询列表页
 */
exports.getVehicles = function (req, res, next) {
    db.query(sqlquery.getVehicles, function (err, resdata) {
        console.log('==========');
        if (err) {
            res.render('users.html', { title: 'Express', datas: [] });  // this renders "views/users.html"
        } else {
            res.render('users.html', { title: 'Express', datas: resdata });
        }
    })
};

/**
 * 新增页面跳转
 */

exports.getAddpage = function (req, res) {
    res.render('add.html');
};

exports.addUser = function (req, res) {
    db.query(sqlquery.addUser(req.body), function (err, resdata) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

exports.addRuntime = function (req, res) {
    db.query(sqlquery.addRuntime(req.body), function (err, resdata) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

exports.addBattery = function (req, res) {
    db.query(sqlquery.addBattery(req.body), function (err, resdata) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

exports.addAlert = function (req, res) {
    db.query(sqlquery.addAlert(req.body), function (err, resdata) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

exports.addOther = function (req, res) {
    db.query(sqlquery.addOther(req.body), function (err, resdata) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

/**
 * 删
 */
exports.deleteUser = function (req, res) {
    var car_vin = req.params.car_VIN;
    var timestamp = req.params.timestamp;
    db.query(sqlquery.deleteUser(car_vin, timestamp), function (err, resdata) {
        if (err) {
            res.end('删除失败：' + err)
        } else {
            res.redirect('/users/TEST')
        }
    });
}

/**
 * 修改
 */
exports.getVehicle = function (req, res) {
    var car_vin = req.params.car_VIN;
    var timestamp = req.params.timestamp;
    db.query(sqlquery.getVehicle(car_vin, timestamp), function (err, resdata) {
        if (err) {
            res.end('修改页面跳转失败：' + err);
        } else {
            res.render("update.html", { datas: resdata });       //直接跳转
        }
    });
}
exports.updateVehicle = function (req, res) {
    var car_vin = req.body.car_VIN;
    var timestamp = req.body.timestamp;
    var col = req.body.col;
    var value = req.body.value;
    db.query(sqlquery.updateVehicle(car_vin, timestamp, col, value), function (err, resdata) {
        if (err) {
            res.end('修改失败：' + err);
        } else {
            res.redirect('/users');
        }
    });
}

/**
 * 查询
 */
exports.searchVehicleRegister = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchRegister(req, sqlquery.searchVehiclebyVIN_Register, sqlquery.searchVehiclebyNUM_Register);
    console.log('localsql is ' + localsql);

    db.query(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            //console.log(resdata);
            res.status(200).send(resdata);
        }
    });
}

exports.searchVehicleRuntime = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchHistory(req, sqlquery.searchVehiclebyVIN_Runtime, sqlquery.searchVehiclebyNUM_Runtime);
    console.log('localsql is ' + localsql);
    db.query(localsql, function (err, resdata) {
        if (err) {
            console.log(err)
            res.end("查询失败：", err)
        } else {
            //console.log(resdata);
            res.status(200).send(resdata);
        }
    });
}

exports.searchVehicleBattery = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchHistory(req, sqlquery.searchVehiclebyVIN_Battery, sqlquery.searchVehiclebyNUM_Battery);
    console.log('localsql is ' + localsql);

    db.query(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            //console.log(resdata);
            res.status(200).send(resdata);
        }
    });
}

exports.searchVehicleAlert = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchHistory(req, sqlquery.searchVehiclebyVIN_Alert, sqlquery.searchVehiclebyNUM_Alert);
    console.log('localsql is ' + localsql);

    db.query(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            //console.log(resdata);
            res.status(200).send(resdata);
        }
    });
}

exports.searchVehicleOther = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchHistory(req, sqlquery.searchVehiclebyVIN_Other, sqlquery.searchVehiclebyNUM_Other);
    console.log('localsql is ' + localsql);

    db.query(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            //console.log(resdata);
            res.status(200).send(resdata);
        }
    });
}