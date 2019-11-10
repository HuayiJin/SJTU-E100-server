var sqlquery = require('./sqlquery');
var safetycheck = require('./safetycheck');

// MySQL数据库联接配置
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'localtest'
});

function db(sql, callback) {
    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(sql, function (err, rows) {
            if(err){
                console.log(err);
            }
            connection.release();//释放链接
            callback(err, rows);
        });
    });
}

exports.get_all_status = function (req, res) {
    console.log(req.query);
    var localsql = 
        "select *,max(timestamp) from CAR_REALTIME_DATA_TEST group by car_VIN";
    console.log('localsql is ' + localsql);

    db(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            console.log(resdata);
            res.status(200).send(resdata);
        }
    });
}


/**
 * 查询列表页
 */
exports.getVehicles = function (req, res, next) {
    db(sqlquery.getVehicles, function (err, resdata) {
        console.log('==========');
        if (err) {
            res.render('users.html', { title: 'Express', datas: [] });  // this renders "views/users.html"
        } else {
            res.render('users.html', { title: 'Express', datas: resdata });
        }
    })
};


/**
 * 查询
 */
exports.searchVehicleRegister = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchRegister(req, sqlquery.searchVehiclebyVIN_Register, sqlquery.searchVehiclebyNUM_Register);
    console.log('localsql is ' + localsql);

    db(localsql, function (err, resdata) {
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
    db(localsql, function (err, resdata) {
        if (err) {
            console.log(err)
            res.end("查询失败：", err)
        } else {
            subresdata = []
            gap = 1
            if(resdata.length > 220){gap = parseInt(resdata.length / 200)}
            for (i=0; i<resdata.length; i+= gap){
                //console.log(i)
                subresdata.push(resdata[i])
            }
            res.status(200).send(subresdata);
        }
    });
}

exports.searchVehicleBattery = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchHistory(req, sqlquery.searchVehiclebyVIN_Battery, sqlquery.searchVehiclebyNUM_Battery);
    console.log('localsql is ' + localsql);

    db(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            subresdata = []
            gap = 1
            if(resdata.length > 220){gap = parseInt(resdata.length / 200)}
            for (i=0; i<resdata.length; i+= gap){
                //console.log(i)
                subresdata.push(resdata[i])
            }
            res.status(200).send(subresdata);
        }
    });
}

exports.searchVehicleAlert = function (req, res) {
    console.log(req.query);
    var localsql = safetycheck.searchHistory(req, sqlquery.searchVehiclebyVIN_Alert, sqlquery.searchVehiclebyNUM_Alert);
    console.log('localsql is ' + localsql);

    db(localsql, function (err, resdata) {
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

    db(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            subresdata = []
            gap = 1
            if(resdata.length > 220){gap = parseInt(resdata.length / 200)}
            for (i=0; i<resdata.length; i+= gap){
                //console.log(i)
                subresdata.push(resdata[i])
            }
            res.status(200).send(subresdata);
        }
    });
}





