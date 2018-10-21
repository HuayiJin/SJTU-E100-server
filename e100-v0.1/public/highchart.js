var chart = null;
// 获取 CSV 数据并初始化图表
var csv2 = "Day,访问量（PV）,访问用户（UV）\n3/9/13,5691,4346\n3/20/13,16970,12599\n3/21/13,17580,13094\n3/22/13,17511,13234\n3/23/13,6601,5213\n3/24/13,6158,4806\n3/25/13,17353,12639\n3/26/13,17660,12768\n3/27/13,16921,12389\n3/28/13,15964,11686\n3/29/13,12028,8891\n3/30/13,5835,4513\n3/31/13,4799,3661\n4/1/13,13037,9503\n4/2/13,16976,12666\n4/3/13,17100,12635\n4/4/13,15701,11394\n4/5/13,14378,10530\n4/6/13,5889,4521\n4/7/13,6779,5109\n4/8/13,16068,11599\n"
$.getJSON('https://data.jianshukeji.com/jsonp?filename=csv/analytics.csv&callback=?', function (csv) {
    chart = Highcharts.chart('chartcontainer000', {
        data: {
            csv: csv2
        },
        title: {
            text: '某网站日常访问量'
        },
        subtitle: {
            text: '数据来源: Google Analytics'
        },
        xAxis: {
            tickInterval: 7 * 24 * 3600 * 1000, // 坐标轴刻度间隔为一星期
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
});
