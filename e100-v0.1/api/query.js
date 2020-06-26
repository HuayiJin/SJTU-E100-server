var sqlquery = require('./sqlquery');
var safetycheck = require('./safetycheck');
var global = require('./global');
var request = require('request');

const db_NAME = "e100";
const tb_NAME = "E100_TABLE_TEST";
const time_tb_NAME = "E100_TABLE_TIMELY"; 
const GLOBAL_limit = 1000; //最多返回1000条数据 
// MySQL数据库联接配置
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'e100'
});

function db(sql, callback) {
    try {
        pool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(sql, function (err, rows) {
                connection.release();//释放链接
                callback(err, rows);
            });
        });
    } catch (error) {
        console.log(error)
        callback(error, null)
    }
}

exports.get_single_info_java = function(req, res){
    console.log(req.query);
    var requestDest = 'http://202.120.60.31:3005/api/datarequest?vin='+req.query.car_VIN;
    request(requestDest, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        res.status(200).send(body);
    });
}

/*============================全局============================*/

//请求所有车辆的当前所有数据(测试用)
exports.get_all_all = function (req, res) {
    var localsql =
        "SELECT a.* FROM " + tb_NAME + 
        " a INNER JOIN (select car_VIN, max(create_time) from " + tb_NAME +
        " GROUP BY car_VIN) b ON a.car_VIN = b.car_VIN and a.create_time = b.`max(create_time)`;"

    db(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.status(200).send(resdata);
        }
    });
}

//请求所有车辆的历史状态（计算多级折线图）
exports.get_history_status = function (req, res) {
    console.log(req.query);
    var limit = 100
    if (req.query.limit) limit = req.query.limit;

    var localsql = 
        "SELECT a.car_VIN, a.create_time, a.vehicle_operating_mode FROM " + tb_NAME +
        " a INNER JOIN (select car_VIN, max(create_time) from " + tb_NAME +
        " GROUP BY car_VIN) b ON a.car_VIN = b.car_VIN and a.create_time = b.`max(create_time)`;"

    db(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            var res_group = []
            var counter = 0;
            for (let i = 0; i < resdata.length; i++) {
                res_group.push({car_VIN:resdata[i].car_VIN})
                res_group[i].latest_info = {
                    create_time: resdata[i].create_time,
                    vehicle_operating_mode: resdata[i].vehicle_operating_mode
                }
            }
            
            for (let i = 0; i < res_group.length; i++) {
                const vin = res_group[i].car_VIN;
                var lsql = "select create_time, vehicle_operating_mode from " + tb_NAME +
                " where car_VIN = \"" + vin +
                "\" and create_time > date_sub(current_timestamp(), interval " + limit + 
                " minute) limit " + GLOBAL_limit;                  
                db(lsql, function (err, sql_result) {
                    if (err) {
                        console.log(err)
                    } else {
                        res_group[i].info = sql_result
                    }
                    counter ++
                    if(counter == res_group.length){
                        res.status(200).send(res_group);
                    }
                })
            }
        }
    });
}

//请求所有(在线、离线、充电)车辆的当前位置
exports.get_all_location = function (req, res) {
    var localsql = 
        "select car_VIN, create_time, longitude, latitude from " + time_tb_NAME +
        " WHERE create_time IN (select max(create_time) from " + time_tb_NAME +
        " group by car_VIN);"

    db(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.status(200).send(resdata);
        }
    });
}

//请求所有车辆的当前状态（用于计算饼图）
exports.get_all_status = function (req, res) {
    var localsql = 
        "SELECT a.car_VIN, a.create_time, a.vehicle_operating_mode FROM " + tb_NAME +
        " a INNER JOIN (select car_VIN, max(create_time) from " + tb_NAME +
        " GROUP BY car_VIN) b ON a.car_VIN = b.car_VIN and a.create_time = b.`max(create_time)`;"

    db(localsql, function (err, resdata) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.status(200).send(resdata);
        }
    });
}

/*============================单车============================*/

//请求单车当前所有信息
exports.get_single_info = function (req, res) {
    if (req.query.car_VIN){
        var localsql = 
        "select * from " + tb_NAME +
        " WHERE create_time in (select max(create_time) from " + tb_NAME +
        " where car_VIN = \"" + req.query.car_VIN + "\")"

        console.log('localsql is ' + localsql);
        db(localsql, function (err, resdata) {
            if (err) {
                res.end("查询失败：", err)
            } else {
                console.log(resdata);
                res.status(200).send(resdata);
            }
        });
    } else {
        console.log(req.query);
        res.status(202).end("NO VIN in request")
    }
}

//请求单车某项历史记录
exports.get_single_history = function (req, res) {
    if (global.dictionary.includes(req.query.type)){
        if (req.query.car_VIN){
            var limit = 100
            if (req.query.limit) limit = req.query.limit;

	    if (req.query.type == "velocity"){
		
            	var localsql = "select create_time, speed from " + time_tb_NAME +
            		" where car_VIN = \"" + req.query.car_VIN +
            		"\" and create_time > date_sub(current_timestamp(), interval " + limit + 
            		" minute) limit " + GLOBAL_limit;
	    } else {	
	        var localsql = "select create_time, " + req.query.type + " from " + tb_NAME +
	            " where car_VIN = \"" + req.query.car_VIN +
        	    "\" and create_time > date_sub(current_timestamp(), interval " + limit + 
	            " minute) limit " + GLOBAL_limit;
	    }    

	console.log(localsql)

            db(localsql, function (err, resdata) {
                if (err) {
                    console.log(err)
                    res.end("查询失败：", err)
                } else {
                    res.status(200).send(resdata);
                }
            });
        } else {
            res.status(202).end("NO VIN in request")
        }
    } else {
        res.status(202).end("request illegal data type")
    }
}

//请求单车历史轨迹
exports.get_single_route = function (req, res) {
    if (req.query.car_VIN){
        var limit = 100
        if (req.query.limit) limit = req.query.limit;

        var localsql = 
        "select create_time, longitude, latitude from " + time_tb_NAME +
        " where car_VIN = \"" + req.query.car_VIN +
        "\" and create_time > date_sub(current_timestamp(), interval " + limit + 
        " minute) limit " + GLOBAL_limit;

        db(localsql, function (err, resdata) {
            if (err) {
                console.log(err)
                res.end("查询失败：", err)
            } else {
                res.status(200).send(resdata);
            }
        });
    } else {
        res.status(202).end("NO VIN in request")
    }
}
