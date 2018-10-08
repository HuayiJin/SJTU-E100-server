

exports.searchRegister = function (req, cb1, cb2) {
    try {
        var searchtype = req.query.searchtype;
        var car_vin = req.query.car_VIN;
        var car_num = req.query.car_NUM;

        if (searchtype == 'byVIN' && car_vin != null) {
            return cb1(car_vin, timestart, timeend);
        }
        else if (searchtype == 'bynumber' && car_num != null) {
            return cb2(car_num, timestart, timeend);
        } else {
            console.log("please input car VIN");
            res.end("please input car VIN");
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.searchHistory = function (req, cb1, cb2) {
    try {
        var searchtype = req.query.searchtype;
        var car_vin = req.query.car_VIN;
        var car_num = req.query.car_NUM;
        var timestart = req.query.bdaytime[0].replace('T', ' ');
        var timeend = req.query.bdaytime[1].replace('T', ' ');

        if (compareTime(timestart, timeend)) {
            if (searchtype == 'byVIN' && car_vin != null) {
                console.log(cb1)
                console.log(timestart)
                console.log(timeend)
                return cb1(car_vin, timestart, timeend);
            }
            else if (searchtype == 'bynumber' && car_num != null) {
                return cb2(car_num, timestart, timeend);
            } else {
                console.log("please input car VIN");
                res.end("please input car VIN");
            }
        } else {
            console.log("wrong date or time");
            res.end("wrong date or time");
        }
    }
    catch (err) {
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
        } else {
            //console.log("startTime小于endTime，所以通过了");   
            return true;
        }
    } else {
        //console.log("时间不能为空");   
        return false;
    }
}   