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
        url: '/users/search/' + route, //请求的url
        type: 'get', //请求的方式
        data: reqdata,
        error:function (data) {
            alert('请求失败');
        },
        success:function (data) {
            var type = "chartselect" + ((i/2) + 1).toString()
            var charttype = document.getElementById(type).value 
            var csv = data2csv(data,charttype)

            chart = Highcharts.chart('chartcontainer', {
                data: {
                    csv: csv
                },
                title: {
                    text: '某网站日常访问量'
                },
                subtitle: {
                    text: '数据来源: Google Analytics'
                },
                xAxis: {
                    tickInterval: 24 * 3600 * 1000, // 坐标轴刻度间隔为一天
                    tickWidth: 0,
                    gridLineWidth: 1,
                    labels: {
                        align: 'left',
                        x: 3,
                        y: -3
                    },
                    // 时间格式化字符
                    // 默认会根据当前的刻度间隔取对应的值，即当刻度间隔为一周时，取 week 值
                    dateTimeLabelFormats: {
                        week: '%Y-%m-%d'
                    }
                },
                yAxis: [{ // 第一个 Y 轴，放置在左边（默认在坐标）
                    title: {
                        text: null
                    },
                    labels: {
                        align: 'left',
                        x: 3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }, {    // 第二个坐标轴，放置在右边
                    linkedTo: 0,
                    gridLineWidth: 0,
                    opposite: true,  // 通过此参数设置坐标轴显示在对立面
                    title: {
                        text: null
                    },
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }],
                legend: {
                    align: 'left',
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    borderWidth: 0
                },
                tooltip: {
                    shared: true,
                    crosshairs: true,
                    // 时间格式化字符
                    // 默认会根据当前的数据点间隔取对应的值
                    // 当前图表中数据点间隔为 1天，所以配置 day 值即可
                    dateTimeLabelFormats: {
                        day: '%Y-%m-%d'
                    }
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                // 数据点点击事件
                                // 其中 e 变量为事件对象，this 为当前数据点对象
                                click: function (e) {
                                    $('.message').html( Highcharts.dateFormat('%Y-%m-%d', this.x) + ':<br/>  访问量：' +this.y );
                                }
                            }
                        },
                        marker: {
                            lineWidth: 1
                        }
                    }
                }
            });
        }
    });
}
var csv2 = "Day,访问量（PV）,访问用户（UV）\n3/20/13,16970,12599\n3/21/13,17580,13094\n3/22/13,17511,13234\n3/23/13,6601,5213\n3/24/13,6158,4806\n3/25/13,17353,12639\n3/26/13,17660,12768\n3/27/13,16921,12389\n3/28/13,15964,11686\n3/29/13,12028,8891\n3/30/13,5835,4513\n3/31/13,4799,3661\n4/1/13,13037,9503\n4/2/13,16976,12666\n4/3/13,17100,12635\n4/4/13,15701,11394\n4/5/13,14378,10530\n4/6/13,5889,4521\n4/7/13,6779,5109\n4/8/13,16068,11599\n"


function data2csv(data,type){
    console.log(type)

    typename = dictionary_en2cn[type]
    console.log(typename)
    var csv = "Time," + typename + " \n";
    for(var i = 0; i < data.length; i += 1){
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