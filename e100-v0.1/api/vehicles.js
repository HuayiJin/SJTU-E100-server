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
            res.redirect('/users/TEST');
        }
    })
};

exports.addRuntime = function (req, res) {  
    db.query(sqlquery.addRuntime(req.body), function (err, rows) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

exports.addBattery = function (req, res) {  
    db.query(sqlquery.addBattery(req.body), function (err, rows) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

exports.addAlert = function (req, res) {  
    db.query(sqlquery.addAlert(req.body), function (err, rows) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users/TEST');
        }
    })
};

exports.addOther = function (req, res) {  
    db.query(sqlquery.addOther(req.body), function (err, rows) {
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
    db.query(sqlquery.deleteUser(car_vin, timestamp), function (err, rows) {
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
    console.log(req.query);
    var localsql = safetycheck_search(req, sqlquery.searchVehiclebyVIN, sqlquery.searchVehiclebyNUM);
    console.log('localsql is ' + localsql);

    db.query(localsql, function (err, rows) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            console.log(rows);
            res.render("users.html", {title: 'Expresstitle', datas: rows});
        }
    });
}


function safetycheck_search(req, cb1, cb2){
    try{
        var searchtype = req.query.searchtype;
        var car_vin = req.query.car_VIN;
        var car_num = req.query.car_NUM;
        var timestart = req.query.bdaytime[0].replace('T',' ');
        var timeend = req.query.bdaytime[1].replace('T',' ');
    
        if(compareTime(timestart, timeend)){
            if(searchtype == 'byVIN' && car_vin != null){
                console.log(cb1)
                console.log(timestart)
                console.log(timeend)
                return cb1(car_vin, timestart, timeend);
            }
            else if(searchtype == 'bynumber' && car_num != null){
                return cb2(car_num, timestart, timeend);
            }else{
                console.log("please input car VIN");
                res.end("please input car VIN");
            }
        }else{
            console.log("wrong date or time");
            res.end("wrong date or time");
        }
    }
    catch(err){
        console.log(err);
    }
}

//判断日期，时间大小  
function compareTime(startDate, endDate) {      
    if (startDate.length > 0 && endDate.length > 0) {   
        var startDateTemp = startDate.split(" ");   
        var endDateTemp = endDate.split(" ");   
                      
        var arrStartDate = startDateTemp[0].split("-");   
        var arrEndDate = endDateTemp[0].split("-");   
        
        var arrStartTime = startDateTemp[1].split(":");   
        var arrEndTime = endDateTemp[1].split(":");   
        
        var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);   
        var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);   
                      
        if (allStartDate.getTime() >= allEndDate.getTime()) {   
            //console.log("startTime不能大于endTime，不能通过");   
            return false;   
        }else{   
            //console.log("startTime小于endTime，所以通过了");   
            return true;   
        }
    }else{   
        //console.log("时间不能为空");   
        return false;   
    }   
}   