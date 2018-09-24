var db = require("./db");
var sqlquery = require('./sqlquery');

/**
 * 查询列表页
 */
exports.getVehicles = function (req, res, next) {
    db.query(sqlquery.getVehicles, function (err, rows) {
    console.log('==========');
        if (err) {
            res.render('users.html', {title: 'Express', datas: []});  // this renders "views/users.html"
        } else {
            res.render('users.html', {title: 'Express', datas: rows});
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
    db.query(sqlquery.addUser(req.body), function (err, rows) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users');
        }
    })
};

/**
 * 删
 */
exports.deleteUser = function (req, res) {
    var car_vin = req.params.car_VIN;
    var timestamp = req.params.timestamp;
    db.query(sqlquery.deleteUser(car_vin, timestamp), function (err, rows) {
        if (err) {
            res.end('删除失败：' + err)
        } else {
            res.redirect('/users')
        }
    });
}

/**
 * 修改
 */
exports.getVehicle = function (req, res) {
    var car_vin = req.params.car_VIN;
    var timestamp = req.params.timestamp;
    db.query(sqlquery.getVehicle(car_vin, timestamp), function (err, rows) {
        if (err) {
            res.end('修改页面跳转失败：' + err);
        } else {
            res.render("update.html", {datas: rows});       //直接跳转
        }
    });
}
exports.updateVehicle = function (req, res) {
    var car_vin = req.body.car_VIN;
    var timestamp = req.body.timestamp;
    var col = req.body.col;
    var value = req.body.value;
    db.query(sqlquery.updateVehicle(car_vin, timestamp, col, value), function (err, rows) {
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
exports.searchVehicle = function (req, res) {
    var car_vin = req.body.car_VIN;
    var timestamp = req.body.timestamp;    
    db.query(sqlquery.searchVehicle(car_vin, timestamp), function (err, rows) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.render("users.html", {title: 'Expresstitle', datas: rows, s_name: name, s_age: age});
        }
    });
}
