var mapdata = null;

function Submit_reg() {
    var reqdata;
    var searchtype = document.getElementsByName("searchtype_reg");

    if(searchtype[0].checked){
        reqdata = "searchtype=" + searchtype[0].value
        + "&car_VIN=" + document.getElementById("car_VIN_reg").value
    }else if(searchtype[1].checked){
        reqdata = "searchtype=" + searchtype[1].value
        + "&car_NUM=" + document.getElementById("car_NUM_reg").value
    }

    $.ajax({
        url: '/users/search/register', //请求的url
        type: 'get', //请求的方式
        data: reqdata,
        error:function (data) {
            alert('请求失败');
        },
        success:function (data) {
            var str1=
            "<tbody><tr><th>车辆VIN</th><td>" + data[0].car_VIN  + "</td></tr>" +
            "<tr><th>注册时间</th><td>" + data[0].registration_time  + "</td></tr>" +
            "<tr><th>车辆类型</th><td>" + data[0].vehicle_type  + "</td></tr>" +
            "<tr><th>储能装置种类</th><td>" + data[0].energy_storing_type  + "</td></tr>" +
            "<tr><th>驱动电机类型</th><td>" + data[0].drive_motor_type  + "</td></tr>" +
            "<tr><th>电机额定功率</th><td>" + data[0].drive_motor_rated_power  + "</td></tr>" +
            "<tr><th>电机额定转速</th><td>" + data[0].drive_motor_rated_rpm  + "</td></tr>" +
            "<tr><th>电机额定转矩</th><td>" + data[0].drive_motor_rated_torque  + "</td></tr></tbody>" ;

            var str2=
            "<tbody><tr><th>电机安装数量</th><td>" + data[0].drive_motor_number + "</td></tr>" +
            "<tr><th>电机布置位置</th><td>" + data[0].drive_motor_position + "</td></tr>" +
            "<tr><th>电机冷却方式</th><td>" + data[0].drive_motor_cooling_method + "</td></tr>" +
            "<tr><th>电动汽车续航里程</th><td>" + data[0].e_car_endurance_mileage + "</td></tr>" +
            "<tr><th>电动汽车最高时速</th><td>" + data[0].e_car_top_speed + "</td></tr>" +
            "<tr><th>电池包数量</th><td>" + data[0].power_battery_number + "</td></tr>" +
            "<tr><th>电池包信息</th><td>" + data[0].power_battery_info_0 + "</td></tr>" +
            "<tr><th>额外字段</th><td>" + data[0].extra_field + "</td></tr></tbody>";
            
            console.dir(data[0])
            //清空table中的html
            $("#regtable1").html(""); 
            $("#regtable2").html("");
            $("#regtable1").append(str1);
            $("#regtable2").append(str2);
        }
    });
}

function Submit_rt(route) {
    var i=0;
    switch(route)
    {
    case 'runtime':
        i=0;break;
    case 'battery':
        i=2;break;
    case 'alert':
        i=4;break;
    case 'other':
        i=6;break;
    case 'rtmap':
        i=8;break;
    }
    var reqdata;
    var searchtype = document.getElementsByName("searchtype_rt");
    var vinid = "car_VIN_rt" + i.toString()
    var numid = "car_NUM_rt" + (i+1).toString()
    var time = document.getElementsByName("bdaytime")

    if(searchtype[i].checked){
        reqdata = "searchtype=" + searchtype[0].value
        + "&car_VIN=" + document.getElementById(vinid).value 
        + "&bdaytime=" + time[i].value + "&bdaytime=" + time[i+1].value ,true
    }else if(searchtype[i+1].checked){
        reqdata = "searchtype=" + searchtype[1].value
        + "&car_NUM=" + document.getElementById(numid).value
        + "&bdaytime=" + time[i].value + "&bdaytime=" + time[i+1].value ,true
    }

    $.ajax({
        url: '/users/search/' + (route=="rtmap"?"runtime":route), //请求的url
        type: 'get', //请求的方式
        data: reqdata,
        error:function (data) {
            alert('请求失败');
        },
        success:function (data) {
            if(i>7){
                mapdata =  data;
                baidumap();
            }
            var type = "chartselect" + ((i/2) + 1).toString()
            var charttype = document.getElementById(type).value 

            var csv = data2csv(data,charttype)

            var chartloc = "chartcontainer" + ((i/2) + 1).toString();
            console.log(chartloc)
            chart = Highcharts.chart(chartloc, {
                chart: {
                    zoomType: 'x'
                },
                data: {
                    csv: csv
                },
                title: {
                    text: '实时数据图'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                    '鼠标拖动可以进行缩放' : '手势操作进行缩放'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    }
                },
                tooltip: {
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%Y-%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    }
                },
                yAxis: {
                    title: {
                        text: charttype
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                }
            });
        }
    });
}

function data2csv(data,type){
    console.log(type)
    console.dir(data)
    typename = dictionary_en2cn[type]
    console.log(typename)
    var csv = "Time," + typename + " \n";
    for(var i = 0; i < data.length; i += 1){
        if(data[i][type] == null){
            continue;
        }
        csv += data[i].timestamp + "," + data[i][type] + "\n";
    }
    return csv;
}

var dictionary_cn2en ={
    "日期": "timestamp",
    "经度": "longitude",
    "纬度": "latitude",
    "车辆运行模式": "vehicle_operating_mode",
    "制动踏板位置": "brake_pedal_status",
    "加速踏板位置": "accelerator_pedal_stroke",
    "档位": "gear_position",
    "钥匙状态": "key_status",
    "驾驶模式": "driving_mode",
    "车速": "velocity",
    "电机状态": "motor_status",
    "电机转矩": "motor_torque",
    "电机转速": "drive_motor_rpm",
    "电机控制器电流": "motor_controller_current",
    "电机控制器电压": "motor_controller_voltage",
    "电机温度": "drive_motor_temperature",
    "电机控制器温度": "motor_controller_temperature",
    "总电流": "high_voltage_battery_current",
    "总电压": "total_battery_voltage",
    "绝缘阻值": "insulation_resistance_value",
    "剩余电量": "residual_energy",
    "电池最高单体电压": "max_single_voltage",
    "电池最低单体电压": "min_single_voltage",
    "总行驶里程": "cumulative_mileage"
}
var dictionary_en2cn = {
    "timestamp" : "日期",
    "longitude" : "经度",
    "latitude" : "纬度",
    "vehicle_operating_mode" : "车辆运行模式",
    "brake_pedal_status" : "制动踏板位置",
    "accelerator_pedal_stroke" : "加速踏板位置",
    "gear_position" : "档位",
    "key_status" : "钥匙状态",
    "driving_mode" : "驾驶模式",
    "velocity" : "车速",
    "motor_status" : "电机状态",
    "motor_torque" : "电机转矩",
    "drive_motor_rpm" : "电机转速",
    "motor_controller_current" : "电机控制器电流",
    "motor_controller_voltage" : "电机控制器电压",
    "drive_motor_temperature" : "电机温度",
    "motor_controller_temperature" : "电机控制器温度",
    "high_voltage_battery_current" : "总电流",
    "total_battery_voltage" : "总电压",
    "insulation_resistance_value" : "绝缘阻值",
    "residual_energy" : "剩余电量",
    "max_single_voltage" : "电池最高单体电压",
    "min_single_voltage" : "电池最低单体电压",
    "cumulative_mileage" : "总行驶里程"
}

function baidumap(){
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);

    var marker = new BMap.Marker(new BMap.Point(116.404, 39.915)); // 创建点
    var polyline = new BMap.Polyline([
        new BMap.Point(116.399, 39.910),
        new BMap.Point(116.405, 39.920),
        new BMap.Point(116.425, 39.900)
    ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线

    map.addOverlay(marker);
}
