<script type="text/javascript">
    var onChangeCalled = false;

    function vinChange(){
        if (onChangeCalled){
            console.log("cascade");
            onChangeCalled = false;
            return;
        }else{
            onChangeCalled = true;
        }

        var requestId = document.getElementById('search-select');
        var requestIdValue = requestId.options[requestId.selectedIndex].value;

        console.log('vinchange to '+requestIdValue);
        console.log('license to '+getLicenseByVin(requestIdValue));
        $('#search-select-license').dropdown('set selected', getLicenseByVin(requestIdValue));
    }

    function licenseChange(){
        if (onChangeCalled){
            console.log("cascade");
            onChangeCalled = false;
            return;
        }else{
            onChangeCalled = true;
        }

        console.log('license change')
        var requestLicense = document.getElementById('search-select-license');
        var requestLicenseValue = requestLicense.options[requestLicense.selectedIndex].value;

        console.log('licensechange to '+requestLicenseValue);
        console.log('vin to '+getVinByLicense(requestLicenseValue));
        $('#search-select').dropdown('set selected', getVinByLicense(requestLicenseValue));
    }

</script>

<script type="text/javascript">

// <!-- 初始化地图 -->

	// 百度地图API功能
	var map = new BMap.Map("mapDiv");  // 创建Map实例
	// map.centerAndZoom("上海交通大学-电子信息与电气工程学院",15);      // 初始化地图,用城市名设置地图中心点
    //必须得要用坐标点，不然没法使用个性化地图
    // map.centerAndZoom(new BMap.Point(121.449051,31.03083),16);   //电院
    map.centerAndZoom(new BMap.Point(121.447176,31.033731),16); //新行政楼

    map.enableScrollWheelZoom(true);    //允许滚轮缩放地图
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
    // map.addControl(top_left_control);        
	// map.addControl(top_left_navigation);     
	map.addControl(top_right_navigation);
    // map.setMapStyleV2({     
    //     styleId: '17c84567c712a49ee687af01700e1d74'
    // });

    // 右键菜单
    var menu = new BMap.ContextMenu();
	var txtMenuItem = [
		{
			text:'返回全局模式',
			callback:function(){backToBackground();}
		},
		// {
		// 	text:'缩小',
		// 	callback:function(){map.zoomOut()}
		// }
	];
	for(var i=0; i < txtMenuItem.length; i++){
		menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
	}
	map.addContextMenu(menu);



// <!-- 测试工具 -->
    function getRandomData(baseValue){
        var amplitude = (Math.random()*baseValue/5).toFixed(2)-0;
        if(Math.random() > 0.5) return baseValue+amplitude;
        else return baseValue-amplitude;

        // return Math.random()*maxValue.toFixed(2)-0;
    }

    var stackTimeStamp = 0;

    function getStackTimeStamp(){
        stackTimeStamp += 1;
        return stackTimeStamp;
    }



    function getNextStep(prePosition){
        var nxtLongi = prePosition['longitude'] + (Math.random()-0.5)/1000;
        var nxtLati = prePosition['latitude'] + (Math.random()-0.5)/1000;
        return {'longitude':nxtLongi, 'latitude':nxtLati};
    }

    var carTraceHistory = [{'longitude':121.451102, 'latitude':31.030699}]

    for(var i = 0; i < 100; ++i){
        carTraceHistory.push(getNextStep(carTraceHistory[carTraceHistory.length-1]));
    }

// <!-- 全局变量 当前激活脚本 状态信息 -->
    var totalOperatingModelCnt = 6;

    // 用于层叠图的全局变量数组
    var stack_online;
    var stack_offline;
    var stack_charging;
    var stack_initmode;
    var stack_poweron;
    var stack_time = new Array();
    var stack_show_time = new Array();
    var stack_value = new Array(totalOperatingModelCnt);
    for(var i = 0; i < totalOperatingModelCnt; ++i){
        stack_value[i] = new Array();
        console.log('stacklen ' + stack_value[i].length);
    }
    // 用于饼图和层叠图更新的数组
    var cur_value = new Array(totalOperatingModelCnt);

    // 当前interval函数句柄
    var curIntervalHandler;

    // 当前是单车模式还是背景模式
    var curSingleMode = false;
    // 判断当前是否需要更新
    // 当鼠标悬停再某个点上时，不更新，防止信息窗口山东
    var needUpdateMap = true;

    // 地图锁
    var mapLocked = false;

    // 当前关注单车
    var curCarVin; 
    var curCarType;

    // 用于侧边栏折线图的数据
    var singleDataPoly = new Array();

    // 单车模式下当前头部点覆盖物句柄
    var curNewOverlayHandler;
    var curOldOverlayHandler;

    // 单车模式下轨迹最近时间戳
    var curTraceStamp;

    // 不同状态下的覆盖物图标
    var iconOnline = new BMap.Icon("icon-green-small.gif", new BMap.Size(25, 25));
    var iconOffline = new BMap.Icon("icon-pink-small.gif", new BMap.Size(25, 25));
    var iconCharging = new BMap.Icon("icon-blue-small.gif", new BMap.Size(25, 25));
    var iconInitmode = new BMap.Icon("icon-purple-small.gif", new BMap.Size(25, 25));
    var iconPoweron = new BMap.Icon("icon-yellow-small.gif", new BMap.Size(25, 25));
    var iconUnknown = new BMap.Icon("icon-orange-small.gif", new BMap.Size(25, 25));

    var iconStart = new BMap.Icon("start.png", new BMap.Size(25, 25));
    var iconEnd = new BMap.Icon("final.png", new BMap.Size(25, 25));

    var iconArr = new Array();
    iconArr.push(iconOnline,iconOffline, iconCharging, iconInitmode, iconPoweron, iconUnknown);

    // 是否需要显示动画
    var needAnimation = [true, true, true, true, true];

    // 时间解析
    // Date.parse("2018-11-30T09:49:50.000Z")
    var timeGap = 1000*60*60*12;    //1000ms/s*60s/min*60min/h*12h

    function timeValidate(rawTime){
        return Math.floor(rawTime.getTime()/timeGap)*timeGap;
    }
    
    // 用于默认查询绘图的车辆原始坐标
    // var onlineCarPosition = [];
    // var offlineCarPosition = [];
    // var chargingCarPosition = [];
    // var poweronCarPosition = [];
    // var initmodeCarPosition = [];


    var carPosition = new Array(totalOperatingModelCnt);
    for(var i = 0; i < carPosition.length; ++i){
        carPosition[i] = new Array();
    }

    var carPositionIdx = new Array(totalOperatingModelCnt);

    function getOperatingModeType(typeStr){
        if(typeStr == '活跃'){
            return 0;
        }else if(typeStr == '休眠'){
            return 1;
        }else if(typeStr == '充电'){
            return 2;
        }else if(typeStr == '初始化'){
            return 3;
        }else if(typeStr == '上电'){
            return 4;
        }else{
            return 5;
        }
    }

    function getOperatingModeTypeName(typeNum){
        if(typeNum == 0){
            return '活跃';
        }else if(typeNum == 1){
            return '休眠';
        }else if(typeNum == 2){
            return '充电';
        }else if(typeNum == 3){
            return '初始化';
        }else if(typeNum == 4){
            return '上电';
        }else{
            return '未知';
        }
    }

    // 用于背景查询，当前需要查哪些值
    // var need_online = true;
    // var need_offline = true;
    // var need_charging = true;
    // var need_initmode = true;
    // var need_poweron = true;

    var needBackgroundRequest = new Array(totalOperatingModelCnt);

    for(var i = 0; i < needBackgroundRequest.length; ++i){
        needBackgroundRequest[i] = true;
    }

    var backgroundRequestProcessing = new Array(totalOperatingModelCnt);
    for(var i = 0; i < backgroundRequestProcessing.length; ++i){
        backgroundRequestProcessing[i] = false;
    }

    // 单车历史轨迹参数
    var singleCarFilteredPoints = new Array();
    var singleCarTranslatedPoints = new Array();
    var singleCarTranslatedPointsIdx = 0;
    var singleCarFilteredPointsIdx = 0;

    // 全局模式下地图覆盖物记录
    var backgroundCarOverlayOld = new Array(totalOperatingModelCnt);
    var backgroundCarOverlayNew = new Array(totalOperatingModelCnt);
    for(var i = 0; i < totalOperatingModelCnt; ++i){
        backgroundCarOverlayOld[i] = new Array();
        backgroundCarOverlayNew[i] = new Array();
    }

    // stack初始化是否完成，防止在空stack里过早插入数据
    var stackInitialFinish = false;

    // 网页过期
    var pageStale = false;

    // 用于背景查询的坐标缓存
    var backGroundPointCache = {};

    // 历史状态接口被封掉之后用all/location接口来画饼图用
    var pie_active_cnt = 0;
    var pie_deactive_cnt = 0;

    var singleCarTraceInitFinish = false;

    var shouldRequestSingle = true;


// <!-- 单车查询 -->
    function do_singleCarTrace(){
        console.log('do_singleCarTrace');
        if(singleCarTranslatedPoints.length == 0){
            alert('no history trace');
            return;
        }
        // console.log(singleCarTranslatedPoints.length);
        curOldOverlayHandler = new BMap.Marker(singleCarTranslatedPoints[0]);
        curOldOverlayHandler.setIcon(iconStart);
        map.addOverlay(curOldOverlayHandler)
        curOldOverlayHandler.setAnimation(BMAP_ANIMATION_DROP);//跳动的动画

        // for(var i = 1; i < singleCarTranslatedPoints.length; ++i){
        //     console.log(i);
        //     drawLine(singleCarTranslatedPoints[i-1], singleCarTranslatedPoints[i]);
        // }

        // var sym = new BMap.Symbol
        // (
        //     BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, //百度预定义的 箭头方向向下的非闭合箭头
        //     {
        //         fillColor : '#0F0', //设置矢量图标的填充颜色。支持颜色常量字符串、十六进制、RGB、RGBA等格式
        //         fillOpacity : 1, //设置矢量图标填充透明度,范围0~1
        //         scale : 0.5, //设置矢量图标的缩放比例
        //         // rotation : 90, //设置矢量图标的旋转角度,参数为角度
        //         strokeColor : '#FFF', //设置矢量图标的线填充颜色,支持颜色常量字符串、十六进制、RGB、RGBA等格式
        //         strokeOpacity : 1, //设置矢量图标线的透明度,opacity范围0~1
        //         strokeWeight : 2, //旋设置线宽。如果此属性没有指定，则线宽跟scale数值相
        //     }
        // );

        // var iconSequence = new BMap.IconSequence
        // (
        //     sym, //symbol为符号样式
        //     '0%', //offset为符号相对于线起点的位置，取值可以是百分比也可以是像素位置，默认为"100%"
        //     '40%', //repeat为符号在线上重复显示的距离，可以是百分比也可以是距离值，同时设置repeat与offset时，以repeat为准
        //     false //fixedRotation设置图标的旋转角度是否与线走向一致，默认为true
        // );
        // var polyline = new BMap.Polyline(
        //     singleCarTranslatedPoints,
        //     {
        //         icons : [iconSequence], //图标集合  **也是我之前没有实现样式改变的最大原因**
        //         strokeColor : '#0F0', //折线颜色 尽量与图标填充色保持一样
        //         strokeOpacity : 1, //折线的透明度，取值范围0 - 1
        //         strokeWeight : 5, //折线的宽度，以像素为单位
        //     }
        // );

        // var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        //     scale: 0.6,//图标缩放大小
        //     strokeColor:'#fff',//设置矢量图标的线填充颜色
        //     strokeWeight: '2',//设置线宽
        // });
        // var icons = new BMap.IconSequence(sy, '10', '30');
        // var polyline =new BMap.Polyline(singleCarTranslatedPoints, {
        //     enableEditing: false,//是否启用线编辑，默认为false
        //     enableClicking: true,//是否响应点击事件，默认为true
        //     icons:[icons],
        //     strokeWeight:'8',//折线的宽度，以像素为单位
        //     strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
        //     strokeColor:"#18a45b" //折线颜色
        // });

        var polyline = new BMap.Polyline(singleCarTranslatedPoints, { strokeColor: "#18a45b", strokeWeight: 5, strokeOpacity: 0.8 });
        map.addOverlay(polyline);

        curNewOverlayHandler = new BMap.Marker(singleCarTranslatedPoints[singleCarTranslatedPoints.length-1]);
        curNewOverlayHandler.setIcon(iconEnd);
        var content = curCarVin;
        map.addOverlay(curNewOverlayHandler)
        curNewOverlayHandler.setAnimation(BMAP_ANIMATION_BOUNCE);//跳动的动画
        addMouseHandler(content, curNewOverlayHandler);

        singleCarTraceInitFinish = true;

        // console.log('brk0');
        
        var view = map.getViewport(eval([curOldOverlayHandler.getPosition(), curNewOverlayHandler.getPosition()]));
        var mapZoom = view.zoom; 
        var centerPoint = view.center; 
        map.centerAndZoom(centerPoint,mapZoom);

    }

    function rawPointValid(lon, lat){
        if (lon == null || lat == null) {
            return false;
        }
        if (lon > 124 || lon < 118 || lat > 35 || lat < 27) {
            return false;
        }
        return true;
    }

    function filterTrace(data){
        console.log('过滤前的历史轨迹长度: '+data.length);
        for(var i = 0; i < data.length; ++i){
            // if (data[i]['longitude'] == null || data[i]['latitude'] == null) {
            //     continue;
            // }
            // if (data[i]['longitude'] > 124 || data[i]['longitude'] < 118 || data[i]['latitude'] > 35 || data[i]['latitude'] < 27) {
            //     continue;
            // }

            if(!rawPointValid(data[i]['longitude'], data[i]['latitude'])){
                continue;
            }

            var curPoint = new BMap.Point(data[i]['longitude'], data[i]['latitude']);
            if(singleCarFilteredPoints.length == 0 || !curPoint.equals(singleCarFilteredPoints[singleCarFilteredPoints.length-1])){
                singleCarFilteredPoints.push(curPoint);
            }
            // if(singleCarFilteredPoints.length > 10) break;
        }
        console.log('过滤完的历史轨迹长度: '+singleCarFilteredPoints.length);

        // console.log(singleCarFilteredPoints.length);
    }

    function translateTrace(){
        console.log('translateTrace');
        var convertor = new BMap.Convertor();
        var pointArr = [];
        for(var j = 0; j < 10; ++j){
            if(singleCarFilteredPointsIdx >= singleCarFilteredPoints.length) break;
            pointArr.push(singleCarFilteredPoints[singleCarFilteredPointsIdx]);
            ++singleCarFilteredPointsIdx;
        }
        // console.log(singleCarFilteredPointsIdx);
        if(pointArr.length > 0) convertor.translate(pointArr, 1, 5, translateCallBackTrace);
    }

    function requestSingleCarTrace(){
        singleCarTraceInitFinish = false;
        $.ajax({
            url: 'http://202.120.60.31:3000/query/single/route', //请求的url
            type: 'get', //请求的方式
            data: 'car_VIN='+curCarVin+'&limit=2880',
            error: function (data) {
                console.log('requestSingleCarTrace请求失败');
            },
            success: function (data) {
                console.log('请求到的历史轨迹长度: '+data.length);
                singleCarTranslatedPoints = new Array();
                singleCarFilteredPoints = new Array();
                singleCarFilteredPointsIdx = 0;
                singleCarTranslatedPointsIdx = 0;
                filterTrace(data);
                translateTrace();
            }
            
        });

    }

    function setSingleCarType(typeName){
        if(typeName == curCarType){
            return;
        }else{
            mapLocked = true;
            curCarType = typeName;
            requestSingleCarHistory();
            mapLocked = false;
        }
    }

    function requestSingleCarHistory(){
        $.ajax({
            url: 'http://202.120.60.31:3000/query/single/history', //请求的url
            type: 'get', //请求的方式
            data: 'car_VIN='+curCarVin+'&type='+curCarType+'&limit=2880',
            error: function (data) {
                console.log('requestSingleCarHistory请求失败');
            },
            success: function (data) {
                console.log('requestSingleCarHistory success '+data.length);
                dataLine = new Array();

                var dataType = curCarType;
                if(dataType == 'velocity'){
                    dataType = 'speed';
                }

                for(var i = 0; i < data.length; ++i){
                    var d = new Date();
                    d.setTime(Date.parse(data[i]['create_time']));
                    dataLine.push({
                        name: d.toString(),
                        // [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/')
                        value: [
                            d.getTime(),
                            data[i][dataType]
                        ]
                    })
                }
                console.log('requestSingleCarHistory: '+dataLine.length+' '+data.length);

                myChartLine.setOption({
                    title:{
                        text:curCarType+' of '+curCarVin
                    },
                    series: [{
                        data: dataLine
                    }]
                });
            }
        });

        // for (var i = 0; i < 5; i++) {
        //     data.shift();
        //     data.push(randomData());
        // }
    
        // myChartLine.setOption({
        //     series: [{
        //         data: data
        //     }]
        // });
        
    }

    function createDetailItem(k, d){
        var result = '<a id="detail_cumulative_mileage" class="item" href="javascript:void(0);">' + k + ' : ' + d + '</a> \n';
        return result;
        
    }

    function requestSingleCar(){
        if(shouldRequestSingle == false) return;
        shouldRequestSingle = false;
        $.ajax({
            url: 'http://202.120.60.31:3000/query/single/info_java', //请求的url
            type: 'get', //请求的方式
            data: 'car_VIN='+curCarVin,
            error: function (data) {
                console.log('requestSingleCar请求失败');
            },
            success: function (data) {
                console.log('requestSingleCar success');
                console.log(data);
                data = JSON.parse(data);
                console.log(data);
                if(!curSingleMode) return;

                if(data.length == 0) return;

                var elementList = '<a class="active item">车辆详情</a>\n';

                // document.getElementById("detail_car").innerHTML = data;
                for(var key in data){
                    // console.log("detail_"+key);
                    // console.log(''+key+ ' : '+data[key]);

                    // var element = document.getElementById('detail_'+key)
                    // if(element != null) element.innerHTML = ''+key+ ' : '+data[key];
                    elementList += createDetailItem(key, data[key]);
                }

                document.getElementById('detail_div').innerHTML = elementList;

                if(rawPointValid(data['longitude'], data['latitude'])){
                    var convertor = new BMap.Convertor();
                    var pointArr = [];
                    pointArr.push(new BMap.Point(data['longitude'], data['latitude']));
                    convertor.translate(pointArr, 1, 5, singleQueryTranslateCallBack);
                }else{
                    // map.removeOverlay(curNewOverlayHandler);
                    // map.addOverlay(curNewOverlayHandler);    
                }

                var curOption = myChartGuage.getOption();
                curOption.series[0].data[0].value = parseInt(data['speed'], 10);
                curOption.series[1].data[0].value = parseInt(data['accPedalPos'], 10);
                curOption.series[2].data[0].value = parseInt(data['batVoltage'], 10);
                curOption.series[3].data[0].value = parseInt(data['batHighTemp'], 10);
                myChartGuage.setOption(curOption,true);

                console.log('speed: '+data['speed']);
                console.log('accPedalPos: '+data['accPedalPos']);
                console.log('batVoltage: '+data['batVoltage']);
                console.log('batHighTemp: '+data['batHighTemp']);

                var d = new Date();
                d.setTime(Date.parse(data['collectTime']));
                dataLine.push({
                    name: d.toString(),
                    // [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/')
                    value: [
                        d.getTime(),
                        data['speed']
                    ]
                })

                myChartLine.setOption({
                    series: [{
                        data: dataLine
                    }]
                });

                shouldRequestSingle = true;
            }
        });

        
    }


    

// <!-- 默认查询 -->
    function requestOnline(){
        // console.log('requestOnline '+carPosition[0].length);
        if(carPosition[0].length == 0){
            drawOverlay(0);
            // backgroundCarOverlayNew[0] = new Array();
            return;
        }
        
        backgroundRequestProcessing[0] = true;
        carPositionIdx[0] = 0;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(new BMap.Point(carPosition[0][carPositionIdx[0]][1],carPosition[0][carPositionIdx[0]][2]));
        convertor.translate(pointArr, 1, 5, translateCallBackOnline);
    }
    function requestOffline(){
        if(carPosition[1].length == 0){
            // console.log("backgroundCarOverlayNew[1].length" + backgroundCarOverlayNew[1].length);
            drawOverlay(1);

            // backgroundCarOverlayNew[1] = new Array();
            return;
        }
        backgroundRequestProcessing[1] = true;
        carPositionIdx[1] = 0;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(new BMap.Point(carPosition[1][carPositionIdx[1]][1],carPosition[1][carPositionIdx[1]][2]));
        convertor.translate(pointArr, 1, 5, translateCallBackOffline);
    }
    function requestCharging(){
        if(carPosition[2].length == 0){
            drawOverlay(2);
            return;
        }
        
        backgroundRequestProcessing[2] = true;
        carPositionIdx[2] = 0;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(new BMap.Point(carPosition[2][carPositionIdx[2]][1],carPosition[2][carPositionIdx[2]][2]));
        convertor.translate(pointArr, 1, 5, translateCallBackCharging);
    }
    function requestInitmode(){
        if(carPosition[3].length == 0){
            drawOverlay(3);
            return;
        }
        
        backgroundRequestProcessing[3] = true;
        carPositionIdx[3] = 0;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(new BMap.Point(carPosition[3][carPositionIdx[3]][1],carPosition[3][carPositionIdx[3]][2]));
        convertor.translate(pointArr, 1, 5, translateCallBackInitmode);
    }
    function requestPoweron(){
        if(carPosition[4].length == 0){
            drawOverlay(4);
            return;
        }
        
        backgroundRequestProcessing[4] = true;
        carPositionIdx[4] = 0;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(new BMap.Point(carPosition[4][carPositionIdx[4]][1],carPosition[4][carPositionIdx[4]][2]));
        convertor.translate(pointArr, 1, 5, translateCallBackPoweron);
    }
    function requestUnknown(){
        if(carPosition[5].length == 0){
            drawOverlay(5);
            return;
        }
        
        backgroundRequestProcessing[5] = true;
        carPositionIdx[5] = 0;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(new BMap.Point(carPosition[5][carPositionIdx[5]][1],carPosition[5][carPositionIdx[5]][2]));
        convertor.translate(pointArr, 1, 5, translateCallBackUnknown);
    }

    // function requestNormal(typeNum){
    //     if(carPosition[typeNum].length == 0) return;
    //     carPositionIdx[typeNum] = 0;
    //     var convertor = new BMap.Convertor();
    //     var pointArr = [];
    //     pointArr.push(new BMap.Point(carPosition[typeNum][carPositionIdx[typeNum]][1],carPosition[typeNum][carPositionIdx[typeNum]][2]));
    //     convertor.translate(pointArr, 1, 5, translateCallBackNor);
    // }

    var requestFunction = [requestOnline, requestOffline, requestCharging, requestInitmode, requestPoweron, requestUnknown];

    var filterDic = {}
    var filteredData = new Array();

    // 过滤全局模式车辆坐标请求返回信息中的重复内容
    function filterBackgroundRequest(data){
        filterDic = {};
        for(var i = 0; i < data.length; ++i){
            var tem_key = data[i]['VIN']
            if(filterDic.hasOwnProperty(tem_key) && (Date.parse(filterDic[tem_key]['collectTime']) >= Date.parse(data[i]['collectTime']))){
                continue;
            }else{
                filterDic[tem_key] = data[i];
            }
        }

        filteredData = new Array();
        for(var k in filterDic){
            if(k == "LK6ADCE20HB005678"){
                console.log("LK6ADCE20HB005678: ")
                console.log(filterDic[k]);
            }
            filteredData.push(filterDic[k]);
        }

    }

    var activeThreshold = 1000*60*3;

    function getMode(logTime, curTime){
        var tem = Date.parse(logTime);
        // console.log('curTime: '+curTime+' logTime: '+tem+' diff: '+(curTime-tem));
        if(curTime-tem > activeThreshold){
            // console.log('5 '+ (curTime-tem));
            return 1; //表示未知
        }else{
            // console.log('0 '+(curTime-tem));

            return 0; //表示运行中
        }
    }

    function backgroundRequest(){
        // map.clearOverlays();
        $.ajax({
            url: 'http://202.120.60.31:3000/query/all/location/batch', //请求的url
            type: 'get', //请求的方式
            error: function (data) {
                console.log('backgroundRequest请求失败');
            },
            success: function (data) {
                var needProcess = Array(totalOperatingModelCnt);
                for(var i = 0; i < totalOperatingModelCnt; ++i){
                    if(backgroundRequestProcessing[i] == true){
                        needProcess[i] = false;
                        console.log('background lock: '+getOperatingModeTypeName(i));
                    }else{
                        needProcess[i] = true
                    }
                }

                for(var i = 0; i < totalOperatingModelCnt; ++i){
                    if(needProcess[i] == false){
                        continue;
                    }else{
                        carPosition[i] = [];
                    }
                }

                var requestcnt = 0;
                var cachecnt = 0;
                var nocarcnt = 0;
                var unequalcnt = 0;
                var undefinecnt = 0;

                console.log("before filter"+data.length);
                filterBackgroundRequest(data);
                console.log("after filter"+filteredData.length)

                var curTime = new Date().getTime();
                pie_active_cnt = 0;
                pie_deactive_cnt = 0;


                for(var i = 0; i < filteredData.length; ++i){

                    // if(i+1 < data.length && data[i]['car_VIN'] == data[i+1]['car_VIN']){
                    //     continue;
                    // }

                    var tem_vin = filteredData[i]['VIN'];
                    var tem_point = new BMap.Point(filteredData[i]['longitude'], filteredData[i]['latitude']);
                    // var tem_type = getOperatingModeType(filteredData[i]['vehicle_operating_mode']);
                    var tem_type = getMode(filteredData[i]['collectTime'], curTime);

                    if(tem_type == 0){
                        pie_active_cnt += 1;
                        // console.log(tem_vin);
                    }else{
                        pie_deactive_cnt += 1;
                    }

                    // backGroundPointCache = {};
                    // console.log(backGroundPointCache);


                    if(backGroundPointCache.hasOwnProperty(tem_vin) && backGroundPointCache[tem_vin]['raw'].equals(tem_point) && backGroundPointCache[tem_vin]['converted'] != undefined){
                        cachecnt += 1;
                        
                        var marker = new BMap.Marker(backGroundPointCache[tem_vin]['converted']);
                        marker.setIcon(iconArr[tem_type]);
                        var content = filteredData[i]['VIN']+' '+vin2license[filteredData[i]['VIN']]+' '+getOperatingModeTypeName(tem_type);
                        // map.addOverlay(marker)
                        // if(needAnimation[5]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
                        addMouseHandler(content, marker);
                        backgroundCarOverlayNew[tem_type].push(marker);
                    }else{
                        requestcnt += 1;
                        if(!backGroundPointCache.hasOwnProperty(tem_vin)){
                            ++nocarcnt;
                        }else if(!backGroundPointCache[tem_vin]['raw'].equals(tem_point)){
                            ++unequalcnt;
                            // console.log('carvin: '+tem_vin);
                            // console.log('unequal: '+filteredData[i]['longitude']+', '+filteredData[i]['latitude']+' old: '+backGroundPointCache[tem_vin]['raw'].lng+', '+backGroundPointCache[tem_vin]['raw'].lat);
                        }else{
                            ++undefinecnt;
                        }

                        backGroundPointCache[tem_vin] = {
                            raw:tem_point,
                            converted:undefined
                        };
                        if(needProcess[tem_type] == true){
                            (carPosition[tem_type]).push([filteredData[i]['VIN']+' '+vin2license[filteredData[i]['VIN']]+' '+getOperatingModeTypeName(tem_type), filteredData[i]['longitude'], filteredData[i]['latitude']]);
                        }
                    }

                    // (carPosition[getOperatingModeType(data[i]['vehicle_operating_mode'])]).push([data[i]['car_VIN']+' '+data[i]['vehicle_operating_mode'], new Bmap.Point(data[i]['longitude'], data[i]['latitude'])]);

                    // (carPosition[getOperatingModeType(data[i]['vehicle_operating_mode'])]).push([data[i]['car_VIN']+' '+data[i]['vehicle_operating_mode'], data[i]['longitude'], data[i]['latitude']]);
                    // if(data[i]['vehicle_operating_mode'] == '活跃'){
                    //     onlineCarPosition.push([data[i]['car_VIN'], data[i]['longitude'], data[i]['latitude']]);
                    // }else if(data[i]['vehicle_operating_mode'] == '离线'){
                    //     offlineCarPosition.push([data[i]['car_VIN'], data[i]['longitude'], data[i]['latitude']]);
                    // }else if(data[i]['vehicle_operating_mode'] == '充电'){
                    //     chargingCarPosition.push([data[i]['car_VIN'], data[i]['longitude'], data[i]['latitude']]);
                    // }else if(data[i]['vehicle_operating_mode'] == '初始化'){
                    //     initmodeCarPosition.push([data[i]['car_VIN'], data[i]['longitude'], data[i]['latitude']]);
                    // }else if(data[i]['vehicle_operating_mode'] == '上电'){
                    //     poweronCarPosition.push([data[i]['car_VIN'], data[i]['longitude'], data[i]['latitude']]);
                    // }
                }

                var option = myChartPie.getOption();
                for(var i = 0; i < totalOperatingModelCnt; ++i){
                    option.series[0].data[i]['value'] = 0;
                }
                option.series[0].data[0]['value'] = pie_active_cnt;
                option.series[0].data[1]['value'] = pie_deactive_cnt;

                myChartPie.setOption(option);

                cur_value[0] = pie_active_cnt;
                cur_value[1] = pie_deactive_cnt;

                console.log('deactive: '+pie_deactive_cnt);

                var curDate = curTime;

                if(stack_time.length == 0 || curDate > stack_time[stack_time.length-1] || _shouldUpdataStack()){
                    if(stack_time.length >= 1500){
                        stack_time.shift();
                        stack_show_time.shift();
                        for(var i = 0; i < totalOperatingModelCnt; ++i){
                            stack_value[i].shift();
                        }
                        // stack_online.shift();
                        // stack_offline.shift();
                        // stack_charging.shift();
                        // stack_poweron.shift();
                        // stack_initmode.shift();
                    }
                    var tem = curDate;
                    stack_time.push(tem);
                    stack_show_time.push(_get_valide_date_for_stack(tem));
                    for(var i = 0; i < 2; ++i){
                        // console.log('stack_value.length'+stack_value.length);

                        // console.log('stack_value[i].length'+stack_value[i].length);

                        (stack_value[i]).push(cur_value[i]);
                    }
                    // stack_online.push(cur_online);
                    // stack_offline.push(cur_offline);
                    // stack_charging.push(cur_charging);
                    // stack_poweron.push(cur_poweron);
                    // stack_initmode.push(cur_initmode);

                    var option = myChartStack.getOption();
                    for(var i = 0; i < totalOperatingModelCnt; ++i){
                        option.series[i].data = stack_value[i];
                    }
                    // option.series[0].data = stack_online;
                    // option.series[1].data = stack_offline;
                    // option.series[2].data = stack_charging;
                    // option.series[3].data = stack_initmode;
                    // option.series[4].data = stack_poweron;
                    option.xAxis[0].data = stack_show_time;

                    myChartStack.setOption(option);

                }

                console.log('request: '+requestcnt+' cache: '+cachecnt);
                console.log('nocar: '+nocarcnt+' unequal: '+unequalcnt+' undefine: '+undefinecnt);

                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     console.log(carPosition[i].length+'');
                // }
                for(var i = 0; i < totalOperatingModelCnt; ++i){
                    // console.log("request: "+i+" "+carPosition[i].length);
                    if((needBackgroundRequest[i] == true) && (needProcess[i] == true)) requestFunction[i]();
                    // console.log(getOperatingModeTypeName(i)+' : '+carPosition[i].length);
                }


            }
        });

        // mapLocked = true;
        

    }

// <!-- 背景查询 -->

    function _get_valide_date_for_stack(millisecond){
        var tem = new Date();
        tem.setTime(millisecond);
        return tem.toLocaleString();
    }

    function _all_zero(idx){
        for(var i = 0; i < totalOperatingModelCnt; ++i){
            if(idx >= stack_value[i].length || stack_value[i][idx] != 0){
                return false;
            }
        }
        return true;
    }
    function do_initialStack(data){
        // console.log(data.length);
        // stack_online = new Array(5000);
        // stack_offline = new Array(5000);
        // stack_charging = new Array(5000);
        // stack_initmode = new Array(5000);
        // stack_poweron = new Array(5000);
        for(var i = 0; i < totalOperatingModelCnt; ++i){
            stack_value[i] = new Array(5000);
        }
        // console.log('stack array initial finish with length: '+stack_value[0].length);
        stack_time = new Array(5000);
        // stack_show_time = new Array(5000);
        
        var curDate = timeValidate(new Date());
        // console.log('curDate'+curDate);

        for(var i = 0; i < 5000; ++i){
            // console.log(i);
            stack_time[5000-1-i] = (curDate-timeGap*i);
            for(var j = 0; j < totalOperatingModelCnt; ++j){
                stack_value[j][i] = 0;
            }
        }

        for(var c = 0; c < data.length; ++c){
            // console.log(c);
            curInfo = data[c]['info']
            // console.log(curInfo.length);
            var curDataIdx = 0;
            for(var i in stack_time){
                                // for(;curDataIdx < curInfo.length && timeValidate(curInfo[curDataIdx]['create_time']) <= stack_time[i]; ++curDataIdx){}
                while(curDataIdx < curInfo.length && Date.parse(curInfo[curDataIdx]['create_time']) <= stack_time[i]){
                    ++curDataIdx;
                }
                // if(curDataIdx < curInfo.length) console.log(curDataIdx+' '+Date.parse(curInfo[curDataIdx]['create_time'])+' '+stack_time[i]);
                // else console.log('achieve length')
                if(curDataIdx == 0){
                    continue;
                }else{
                    stack_value[getOperatingModeType(curInfo[curDataIdx-1]['vehicle_operating_mode'])][i] += 1;
                    // if(curInfo[curDataIdx-1]['vehicle_operating_mode'] == '活跃'){
                    //     stack_online[i] += 1;
                    // }else if(curInfo[curDataIdx-1]['vehicle_operating_mode'] == '充电'){
                    //     stack_charging[i] += 1;
                    // }else if(curInfo[curDataIdx-1]['vehicle_operating_mode'] == '休眠'){
                    //     stack_offline[i] += 1;
                    // }else if(curInfo[curDataIdx-1]['vehicle_operating_mode'] == '上电'){
                    //     stack_poweron[i] += 1;
                    // }else if(curInfo[curDataIdx-1]['vehicle_operating_mode'] == '初始化'){
                    //     stack_initmode[i] += 1;
                    // }
                }
            }
        }
        while(stack_time.length > 0){
            if(_all_zero(0)){
                for(var i = 0; i < totalOperatingModelCnt; ++i){
                    stack_value[i].shift();
                }
                // stack_online.shift();
                // stack_offline.shift();
                // stack_charging.shift();
                // stack_poweron.shift();
                // stack_initmode.shift();
                stack_time.shift();
            }else{
                break;
            }
        }

        for(var i = 0; i < stack_time.length; ++i){
            // var tem = new Date();
            // tem.setTime(stack_time[i]);
            stack_show_time.push(_get_valide_date_for_stack(stack_time[i]));
        }

        // console.log(stack_value[0].length);

        var option = myChartStack.getOption();
        for(var i = 0; i < totalOperatingModelCnt; ++i){
            option.series[i].data = stack_value[i];
        }
        // option.series[0].data = stack_online;
        // option.series[1].data = stack_offline;
        // option.series[2].data = stack_charging;
        // option.series[3].data = stack_initmode;
        // option.series[4].data = stack_poweron;
        option.xAxis[0].data = stack_show_time;
        // option.xAxis[0].data = stack_time;


        myChartStack.setOption(option);

        stackInitialFinish = true;

    }

    // 初始化层叠图
    function initialStack(){
        $.ajax({
            url: 'http://202.120.60.31:3000/query/history/status', //请求的url
            type: 'get', //请求的方式
            data: 'limit=5000000',
            error: function (data) {
                console.log('initialStack请求失败');
            },
            success: function (data) {
                do_initialStack(data);
            }
            
        });

    }

    function _shouldUpdataStack(){
        for(var i = 0; i < totalOperatingModelCnt; ++i){
            if(cur_value[i] != stack_value[i][stack_value[i].length-1]){
                return true;
            }
        }
        return false;
    }

    function requestCurrentTypeNum(){
        $.ajax({
            url: 'http://202.120.60.31:3000/query/history/status', //请求的url
            type: 'get', //请求的方式
            data: 'limit=0',
            error: function (data) {
                console.log('requestCurrentTypeNum请求失败');
            },
            success: function (data) {
                // var cur_online = 0;
                // var cur_offline = 0;
                // var cur_charging = 0;
                // var cur_initmode = 0;
                // var cur_poweron = 0;
                
                for(var i = 0; i < totalOperatingModelCnt; ++i){
                    cur_value[i] = 0;
                }
                
                for(var i in data){
                    cur_value[getOperatingModeType(data[i]['latest_info']['vehicle_operating_mode'])] += 1;

                    // if(data[i]['latest_info']['vehicle_operating_mode'] == '休眠'){
                    //     ++cur_offline;
                    // }else if(data[i]['latest_info']['vehicle_operating_mode'] == '活跃'){
                    //     ++cur_online;
                    // }else if(data[i]['latest_info']['vehicle_operating_mode'] == '充电'){
                    //     ++cur_charging;
                    // }else if(data[i]['latest_info']['vehicle_operating_mode'] == '上电'){
                    //     ++cur_poweron;
                    // }else if(data[i]['latest_info']['vehicle_operating_mode'] == '初始化'){
                    //     ++cur_initmode;
                    // }
                }

                // pie的修改转移到背景查询中了
                // var option = myChartPie.getOption();
                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     // option.series[0].data[i]['value'] = cur_value[i];
                //     option.series[0].data[i]['value'] = 0;
                // }
                // option.series[0].data[0]['value'] = pie_active_cnt;
                // option.series[0].data[1]['value'] = pie_deactive_cnt;

                // // option.series[0].data[0]['value'] = cur_online;
                // // option.series[0].data[1]['value'] = cur_offline;
                // // option.series[0].data[2]['value'] = cur_charging;
                // // option.series[0].data[3]['value'] = cur_initmode;
                // // option.series[0].data[4]['value'] = cur_poweron;
                // myChartPie.setOption(option);

                // console.log('brk 1');
                // var curDate = timeValidate(new Date());
                if(!stackInitialFinish) return;

                var curDate = new Date().getTime();

                if(stack_time.length == 0 || curDate > stack_time[stack_time.length-1] || _shouldUpdataStack()){
                    if(stack_time.length >= 1500){
                        stack_time.shift();
                        stack_show_time.shift();
                        for(var i = 0; i < totalOperatingModelCnt; ++i){
                            stack_value[i].shift();
                        }
                        // stack_online.shift();
                        // stack_offline.shift();
                        // stack_charging.shift();
                        // stack_poweron.shift();
                        // stack_initmode.shift();
                    }
                    var tem = new Date().getTime();
                    stack_time.push(tem);
                    stack_show_time.push(_get_valide_date_for_stack(tem));
                    for(var i = 0; i < totalOperatingModelCnt; ++i){
                        // console.log('stack_value.length'+stack_value.length);
                        if(stack_value[i] == undefined) stack_value = new Array();
                        console.log('stack_value[i].length'+stack_value[i].length);

                        (stack_value[i]).push(cur_value[i]);
                    }
                    // stack_online.push(cur_online);
                    // stack_offline.push(cur_offline);
                    // stack_charging.push(cur_charging);
                    // stack_poweron.push(cur_poweron);
                    // stack_initmode.push(cur_initmode);

                    var option = myChartStack.getOption();
                    for(var i = 0; i < totalOperatingModelCnt; ++i){
                        option.series[i].data = stack_value[i];
                    }
                    // option.series[0].data = stack_online;
                    // option.series[1].data = stack_offline;
                    // option.series[2].data = stack_charging;
                    // option.series[3].data = stack_initmode;
                    // option.series[4].data = stack_poweron;
                    option.xAxis[0].data = stack_show_time;

                    myChartStack.setOption(option);

                }
            }
        });

        /**
         * stack初始化方法，UTC时间->毫秒数
         * 从此刻开始向前追溯一定的距离，每1000ms为array中的一个单位
         * 针对每辆car
         *  针对每个时间单为
         *      遍历info数组，知道到时间不大于当前单位的那个元素，填入
         * 
         */
        // var cur_online = getRandomData(100);
        // var cur_offline = getRandomData(50);
        // var cur_charging = getRandomData(50);

        // // var option = myChartPie.getOption();
        // // option.series[0].data[0]['value'] = cur_online;
        // // option.series[0].data[1]['value'] = cur_offline;
        // // option.series[0].data[2]['value'] = cur_charging;
        // // myChartPie.setOption(option);

        // stack_time.shift();
        // stack_time.push(getStackTimeStamp());
        // stack_online.shift();
        // stack_online.push(cur_online);
        // stack_offline.shift();
        // stack_offline.push(cur_offline);
        // stack_charging.shift();
        // stack_charging.push(cur_charging);

        // option = myChartStack.getOption();
        // option.series[0].data = stack_online;
        // option.series[1].data = stack_offline;
        // option.series[2].data = stack_charging;
        // option.xAxis[0].data = stack_time;

        // myChartStack.setOption(option);
    }


// <!-- 回调函数 -->  

    // <!-- 饼图回调函数 --> 
    function eConsole(param) {
        needBackgroundRequest[param.dataIndex] = !needBackgroundRequest[param.dataIndex];
        if(needBackgroundRequest[param.dataIndex] == false){
            for(var i = 0; i < backgroundCarOverlayOld[param.dataIndex].length; ++i){
                map.removeOverlay(backgroundCarOverlayOld[param.dataIndex][i]);
            }
            // backgroundCarOverlayOld[param.dataIndex];
        }else{
            if(backgroundCarOverlayOld[param.dataIndex].length != 0){
                for(var i = 0; i < backgroundCarOverlayOld[param.dataIndex].length; ++i){
                    map.addOverlay(backgroundCarOverlayOld[param.dataIndex][i]);
                }
            }
        }
        needAnimation[param.dataIndex] = true;
    }

    // <!-- 搜索点击回调函数 -->
    function onClickSearchButton(){
        var requestType = document.getElementById('select');
        var requestTypeValue = requestType.options[requestType.selectedIndex].value;
        var requestId = document.getElementById('search-select');
        var requestIdValue = requestId.options[requestId.selectedIndex].value;

        do_initRequestSingleCar(requestTypeValue, requestIdValue)

    }

    // <!-- 地图覆盖物点击回调函数 -->
    function onClickOverlay(targetId){
        var requestType = document.getElementById('select');
        var requestTypeValue = requestType.options[requestType.selectedIndex].value;

        //TODO: 通过车辆选择之后也要进行选择框联动修改
        // $('#search-select')
        //     .dropdown('set selected', targetId)
        // ;

        do_initRequestSingleCar(requestTypeValue, targetId)

        // onClickSearchButton()
        // console.log(targetId);
    }

    // <!-- 进入单车模式的实际执行函数 -->
    function do_initRequestSingleCar(requestTypeValue, requestIdValue){
        // data = [];
        // for (var i = 0; i < 1000; i++) {
        //     data.push(randomData());
        // }
        console.log('single start');
        document.getElementById("right_bottom_coner_default").style.display="none";//隐藏
        document.getElementById("right_bottom_coner_detail").style.display="";//隐藏


        // if(requestIdValue != 'LK6ADCE28JB008253') console.log('no data yet');
        // else{
            mapLocked = true;
            map.clearOverlays();
            curSingleMode = true;
            curCarVin = requestIdValue;
            curCarType = requestTypeValue;
            requestSingleCarTrace();
            requestSingleCarHistory();
            // map.addEventListener('click', function(){console.log('EventListener trigged')});
            curSingleMode = true;
            mapLocked = false;
            console.log('request History finish'+ curSingleMode);
            shouldRequestSingle = true;

            
        // }
    }

    // 进入单车模式后增加的地图回调函数 用于返回到默认模式
    function backToBackground(){
        console.log("evoke");
        map.clearOverlays();
        // map.removeEventListener("click", backToBackground);
        for(var i = 0; i < needAnimation.length; ++i){
            needAnimation[i] = true;
        }
        map.centerAndZoom(new BMap.Point(121.447176,31.033731),16); //新行政楼

        var option = myChartGuage.getOption();
        option.series[0].data[0].value = 0;
        option.series[1].data[0].value = 0;
        option.series[2].data[0].value = 0;
        option.series[3].data[0].value = 0;
        myChartGuage.setOption(optionGuage);

        dataLine=[];

        myChartLine.setOption({
            title:{
                text:' '
            },
            series: [{
                data: dataLine
            }]
        });

        for(var i = 0; i < totalOperatingModelCnt; ++i){
            
            if(needBackgroundRequest[i] && backgroundCarOverlayOld[i].length != 0){
                for(var j = 0; j < backgroundCarOverlayOld[i].length; ++j){
                    map.addOverlay(backgroundCarOverlayOld[i][j]);
                }
            }
        }

        curSingleMode = false;
        document.getElementById("right_bottom_coner_detail").style.display="none";//隐藏
        document.getElementById("right_bottom_coner_default").style.display="";

        console.log('backtoground cursinglemode='+curSingleMode);
    }

    // 百度地图坐标转换回调函数
    function translateCallBackOnline(data){
        // console.log('onlineCallback');
        if(data.status != 0){
            console.log('translateCallBackOnline错误');
        }else{
            var marker = new BMap.Marker(data.points[0]);
            marker.setIcon(iconArr[0]);
            var content = carPosition[0][carPositionIdx[0]][0];
            // map.addOverlay(marker)
            // if(needAnimation[0]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
            addMouseHandler(content, marker);
            backgroundCarOverlayNew[0].push(marker);

            var tem_vin = content.split(' ')[0];
            backGroundPointCache[tem_vin]['converted'] = data.points[0];

            
            ++carPositionIdx[0];
            if(carPositionIdx[0] == carPosition[0].length){
                needAnimation[0] = false;
                backgroundRequestProcessing[0] = false;
                drawOverlay(0);

                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     if(carPositionIdx[i] != carPosition[i].length){
                //         return;
                //     }
                // }
                // mapLocked = false;
            }else{
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(new BMap.Point(carPosition[0][carPositionIdx[0]][1],carPosition[0][carPositionIdx[0]][2]));
                convertor.translate(pointArr, 1, 5, translateCallBackOnline);
            }
        }
    }

    function translateCallBackOffline(data){
        if(data.status != 0){
            console.log('translateCallBackOffline错误');
        }else{
            // console.log(data);
            var marker = new BMap.Marker(data.points[0]);
            marker.setIcon(iconArr[1]);
            var content = carPosition[1][carPositionIdx[1]][0];
            // console.log(content);
            // console.log(''+carPosition[1][carPositionIdx[1]][0] +', '+ carPosition[1][carPositionIdx[1]][1] + ', '+ carPosition[1][carPositionIdx[1]][2])

            // if(carPosition[1][carPositionIdx[1]][0] == 'LK6ADCE20HB005700 休眠'){
            //     console.log(''+carPosition[1][carPositionIdx[1]][0] +', '+ carPosition[1][carPositionIdx[1]][1] + ', '+ carPosition[1][carPositionIdx[1]][2])
            //     console.log(data.points[0])
            // }

            // map.addOverlay(marker)
            // if(needAnimation[1]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
            addMouseHandler(content, marker);
            backgroundCarOverlayNew[1].push(marker);

            var tem_vin = content.split(' ')[0];
            backGroundPointCache[tem_vin]['converted'] = data.points[0];

            
            ++carPositionIdx[1];
            if(carPositionIdx[1] == carPosition[1].length){
                needAnimation[1] = false;
                backgroundRequestProcessing[1] = false;
                drawOverlay(1);

                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     if(carPositionIdx[i] != carPosition[i].length){
                //         return;
                //     }
                // }
                // mapLocked = false;
            }else{
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(new BMap.Point(carPosition[1][carPositionIdx[1]][1],carPosition[1][carPositionIdx[1]][2]));
                convertor.translate(pointArr, 1, 5, translateCallBackOffline);
            }
        }
    }

    function translateCallBackCharging(data){
        if(data.status != 0){
            console.log('translateCallBackCharging');
        }else{
            var marker = new BMap.Marker(data.points[0]);
            marker.setIcon(iconArr[2]);
            var content = carPosition[2][carPositionIdx[2]][0];
            // map.addOverlay(marker)
            // if(needAnimation[2]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
            addMouseHandler(content, marker);
            backgroundCarOverlayNew[2].push(marker);

            var tem_vin = content.split(' ')[0];
            backGroundPointCache[tem_vin]['converted'] = data.points[0];

            
            ++carPositionIdx[2];
            if(carPositionIdx[2] == carPosition[2].length){
                needAnimation[2] = false;
                backgroundRequestProcessing[2] = false;
                drawOverlay(2);

                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     if(carPositionIdx[i] != carPosition[i].length){
                //         return;
                //     }
                // }
                // mapLocked = false;
            }else{
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(new BMap.Point(carPosition[2][carPositionIdx[2]][1],carPosition[2][carPositionIdx[2]][2]));
                convertor.translate(pointArr, 1, 5, translateCallBackCharging);
            }
        }
    }

    function translateCallBackInitmode(data){
        if(data.status != 0){
            console.log('translateCallBackInitmode');
        }else{
            var marker = new BMap.Marker(data.points[0]);
            marker.setIcon(iconArr[3]);
            var content = carPosition[3][carPositionIdx[3]][0];
            // map.addOverlay(marker)
            // if(needAnimation[3]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
            addMouseHandler(content, marker);
            backgroundCarOverlayNew[3].push(marker);

            var tem_vin = content.split(' ')[0];
            backGroundPointCache[tem_vin]['converted'] = data.points[0];

            
            ++carPositionIdx[3];
            if(carPositionIdx[3] == carPosition[3].length){
                needAnimation[3] = false;
                backgroundRequestProcessing[3] = false;
                drawOverlay(3);

                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     if(carPositionIdx[i] != carPosition[i].length){
                //         return;
                //     }
                // }
                // mapLocked = false;
            }else{
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(new BMap.Point(carPosition[3][carPositionIdx[3]][1],carPosition[3][carPositionIdx[3]][2]));
                convertor.translate(pointArr, 1, 5, translateCallBackInitmode);
            }
        }
    }

    function translateCallBackPoweron(data){
        if(data.status != 0){
            console.log('translateCallBackPoweron');
        }else{
            var marker = new BMap.Marker(data.points[0]);
            marker.setIcon(iconArr[4]);
            var content = carPosition[4][carPositionIdx[4]][0];
            // map.addOverlay(marker)
            // if(needAnimation[4]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
            addMouseHandler(content, marker);
            backgroundCarOverlayNew[4].push(marker);

            var tem_vin = content.split(' ')[0];
            backGroundPointCache[tem_vin]['converted'] = data.points[0];

            
            ++carPositionIdx[4];
            if(carPositionIdx[4] == carPosition[4].length){
                needAnimation[4] = false;
                backgroundRequestProcessing[4] = false;
                drawOverlay(4);

                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     if(carPositionIdx[i] != carPosition[i].length){
                //         return;
                //     }
                // }
                // mapLocked = false;
            }else{
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(new BMap.Point(carPosition[4][carPositionIdx[4]][1],carPosition[4][carPositionIdx[4]][2]));
                convertor.translate(pointArr, 1, 5, translateCallBackPoweron);
            }
        }
    }

    function translateCallBackUnknown(data){
        if(data.status != 0){
            console.log('translateCallBackPoweron');
        }else{
            // console.log('unknown translate doing');
            

            var marker = new BMap.Marker(data.points[0]);
            marker.setIcon(iconArr[5]);
            var content = carPosition[5][carPositionIdx[5]][0];
            // map.addOverlay(marker)
            // if(needAnimation[5]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
            addMouseHandler(content, marker);
            backgroundCarOverlayNew[5].push(marker);

            var tem_vin = content.split(' ')[0];
            backGroundPointCache[tem_vin]['converted'] = data.points[0];

            
            ++carPositionIdx[5];
            if(carPositionIdx[5] == carPosition[5].length){
                needAnimation[5] = false;
                // console.log('unknown translate finish');
                backgroundRequestProcessing[5] = false;
                drawOverlay(5);

                // for(var i = 0; i < totalOperatingModelCnt; ++i){
                //     if(carPositionIdx[i] != carPosition[i].length){
                //         return;
                //     }
                // }
                // mapLocked = false;
            }else{
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(new BMap.Point(carPosition[5][carPositionIdx[5]][1],carPosition[5][carPositionIdx[5]][2]));
                convertor.translate(pointArr, 1, 5, translateCallBackUnknown);
            }
        }
    }

    // function translateCallBackNormal(data, typeNum){
    //     if(data.status != 0){
    //         console.log('translateCallBackNormal '+typeNum);
    //     }else{
    //         var marker = new BMap.Marker(data.points[0]);
    //         marker.setIcon(iconArr[typeNum]);
    //         var content = carPosition[typeNum][carPositionIdx[typeNum]][0];
    //         // map.addOverlay(marker)
    //         // if(needAnimation[5]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
    //         addMouseHandler(content, marker);
    //         backgroundCarOverlayNew[typeNum].push(marker);
            
    //         ++carPositionIdx[typeNum];
    //         if(carPositionIdx[typeNum] == carPosition[typeNum].length){
    //             needAnimation[typeNum] = false;
    //             drawOverlay(typeNum);
    //             // for(var i = 0; i < totalOperatingModelCnt; ++i){
    //             //     if(carPositionIdx[i] != carPosition[i].length){
    //             //         return;
    //             //     }
    //             // }
    //             // mapLocked = false;
    //         }else{
    //             var convertor = new BMap.Convertor();
    //             var pointArr = [];
    //             pointArr.push(new BMap.Point(carPosition[typeNum][carPositionIdx[typeNum]][1],carPosition[typeNum][carPositionIdx[typeNum]][2]));
    //             convertor.translate(pointArr, 1, 5, translateCallBackPoweron);
    //         }
    //     }
    // }

    function translateCallBackTrace(data){
        if(data.status != 0){
            console.log('translateCallBackTrace');
        }else{
            for(var i = 0; i < data.points.length; ++i){
                singleCarTranslatedPoints.push(data.points[i]);
                if(singleCarTranslatedPoints.length > 1){
                    // console.log('draw: '+singleCarTranslatedPoints.length);
                    // drawLine(singleCarTranslatedPoints[singleCarTranslatedPoints.length-2], singleCarTranslatedPoints[singleCarTranslatedPoints.length-1]);
                }
            }
            // console.log(singleCarTranslatedPoints.length);
            if(singleCarFilteredPointsIdx >= singleCarFilteredPoints.length){
                console.log('translate finish: '+singleCarTranslatedPoints.length);
                do_singleCarTrace();
            }else{
                var convertor = new BMap.Convertor();
                var pointArr = [];
                console.log("singleCarFilteredPointsIdx Str: "+singleCarFilteredPointsIdx);

                for(var j = 0; j < 10; ++j){
                    if(singleCarFilteredPointsIdx >= singleCarFilteredPoints.length) break;
                    pointArr.push(singleCarFilteredPoints[singleCarFilteredPointsIdx]);
                    ++singleCarFilteredPointsIdx;
                }
                console.log("singleCarFilteredPointsIdx Fin: "+singleCarFilteredPointsIdx);

                convertor.translate(pointArr, 1, 5, translateCallBackTrace);
            }
        }
    }

    function drawOverlay(typeNum){
        // console.log(getOperatingModeTypeName(typeNum));
        for(var i = 0; i < backgroundCarOverlayOld[typeNum].length; ++i){
            map.removeOverlay(backgroundCarOverlayOld[typeNum][i]);
        }
        backgroundCarOverlayOld[typeNum] = new Array();
        for(var i = 0; i < backgroundCarOverlayNew[typeNum].length; ++i){
            if(needBackgroundRequest[typeNum] && !curSingleMode){
                map.addOverlay(backgroundCarOverlayNew[typeNum][i]);
            }
            backgroundCarOverlayOld[typeNum].push(backgroundCarOverlayNew[typeNum][i]);
        }
        backgroundCarOverlayNew[typeNum] = new Array();
    }

    function singleQueryTranslateCallBack(data){
        if(data.status != 0){
            console.log('singleQueryTranslateCallBack');
        }else if(singleCarTraceInitFinish == false){
            console.log('singleTrace : new query evoked, but initial not yet finished')
        }else{
            if(singleCarTranslatedPoints.length == 0){
                singleCarTranslatedPoints.push(data.points[0]);

                curOldOverlayHandler = new BMap.Marker(singleCarTranslatedPoints[0]);
                curOldOverlayHandler.setIcon(iconStart);
                map.addOverlay(curOldOverlayHandler)
                curOldOverlayHandler.setAnimation(BMAP_ANIMATION_DROP);//跳动的动画

                curNewOverlayHandler = new BMap.Marker(singleCarTranslatedPoints[singleCarTranslatedPoints.length-1]);
                curNewOverlayHandler.setIcon(iconEnd);
                var content = curCarVin;
                map.addOverlay(curNewOverlayHandler)
                curNewOverlayHandler.setAnimation(BMAP_ANIMATION_BOUNCE);//跳动的动画
                addMouseHandler(content, curNewOverlayHandler);
            }else if(!((data.points[0]).equals(singleCarTranslatedPoints[singleCarTranslatedPoints.length-1]))){
                console.log('final icon should move');
                map.removeOverlay(curNewOverlayHandler);

                curNewOverlayHandler = new BMap.Marker(data.points[0]);
                curNewOverlayHandler.setIcon(iconEnd);
                var content = curCarVin;
                map.addOverlay(curNewOverlayHandler)
                curNewOverlayHandler.setAnimation(BMAP_ANIMATION_BOUNCE);//跳动的动画
                addMouseHandler(content, curNewOverlayHandler);

                var polyline = new BMap.Polyline([singleCarTranslatedPoints[singleCarTranslatedPoints.length-1], data.points[0]], { strokeColor: "#18a45b", strokeWeight: 5, strokeOpacity: 0.8 });
                map.addOverlay(polyline);

                singleCarTranslatedPoints.push(data.points[0]);
                
            }
        }
    }
// <!-- 绘图 -->
// <!-- 右侧栏仪表盘 开始 -->


var domGuage = document.getElementById("guage");
    var myChartGuage = echarts.init(domGuage);
    var app = {};
    optionGuage = null;
    optionGuage = {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //         restore: {show: true},
        //         saveAsImage: {show: true}
        //     }
        // },
        series : [
            {
                name: '速度',
                type: 'gauge',
                z: 3,
                center: ['48%', '50%'],    // 默认全局居中

                min: 0,
                max: 50,
                splitNumber: 10,
                radius: '55%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color : [ //表盘颜色
                            [ 0.2,  "#8FBC8F"],//0-50%处的颜色
                            [ 0.6, "#4F94CD" ],//51%-70%处的颜色
                            [ 1, "#B22222" ],//70%-90%处的颜色
                        ],
                        width: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: "15%",        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: "20%",         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {
                    backgroundColor: 'auto',
                    borderRadius: 2,
                    color: '#eee',
                    padding: 3,
                    fontSize:'70%',
                    textShadowBlur: 2,
                    textShadowOffsetX: 1,
                    textShadowOffsetY: 1,
                    textShadowColor: '#222'
                },
                pointer: {
                    width:"7%"
                },
                title : {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: '60%',
                    fontStyle: 'italic'
                },
                detail : {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    formatter: function (value) {
                        value = (value + '').split('.');
                        value.length < 2 && (value.push('00'));
                        return ('00' + value[0]).slice(-2)
                            + '.' + (value[1] + '00').slice(0, 2);
                    },
                    fontWeight: 'bolder',
                    borderRadius: 3,
                    backgroundColor: '#444',
                    borderColor: '#aaa',
                    shadowBlur: 5,
                    shadowColor: '#333',
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                    borderWidth: 2,
                    textBorderColor: '#000',
                    textBorderWidth: 2,
                    textShadowBlur: 2,
                    textShadowColor: '#fff',
                    textShadowOffsetX: 0,
                    textShadowOffsetY: 0,
                    fontFamily: 'Arial',
                    fontSize:'100%',
                    width: 100,
                    color: '#eee',
                    rich: {}
                },
                data:[{value: 0, name: 'km/h'}]
            },
            {
                name: '转速',
                type: 'gauge',
                center: ['15%', '55%'],    // 默认全局居中
                radius: '30%',
                min:0,
                max:7,
                endAngle:50,
                splitNumber:7,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length:'15%',        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length:'20%',         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:"8%"
                },
                title: {
                    offsetCenter: [0, '-30%'],       // x, y，单位px
                    fontSize:'60%'
                },
                detail: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize:'10%',
                },
                data:[{value: 0, name: 'x1000 r/min'}]
            },
            {
                name: '电量',
                type: 'gauge',
                center: ['80%', '40%'],    // 默认全局居中
                radius: '25%',
                min: 0,
                max: 100,
                startAngle: 135,
                endAngle: 45,
                splitNumber: 2,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 5,
                    length: '10%',        // 属性length控制线长
                    lineStyle: {        // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {
                    formatter:function(v){
                        switch (v + '') {
                            case '0' : return 'E';
                            case '1' : return 'Gas';
                            case '2' : return 'F';
                        }
                    }
                },
                splitLine: {           // 分隔线
                    length: '15%',         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:"4%"
                },
                title : {
                    show: false
                },
                detail : {
                    show: false
                },
                data:[{value: 0, name: '%'}]
            },
            {
                name: '温度',
                type: 'gauge',
                center : ['80%', '58%'],    // 默认全局居中
                radius : '25%',
                min: 0,
                max: 80,
                startAngle: 315,
                endAngle: 225,
                splitNumber: 2,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    show: false
                },
                axisLabel: {
                    formatter:function(v){
                        switch (v + '') {
                            case '0' : return 'H';
                            case '1' : return 'Water';
                            case '2' : return 'C';
                        }
                    }
                },
                splitLine: {           // 分隔线
                    length: '15%',         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:"4%"
                },
                title: {
                    show: false
                },
                detail: {
                    show: false
                },
                data:[{value: 0, name: '°C'}]
            }
        ]
    };
    
    // setInterval(function (){
    //     optionGuage.series[0].data[0].value = (Math.random()*60).toFixed(2) - 0;
    //     optionGuage.series[1].data[0].value = (Math.random()*7).toFixed(2) - 0;
    //     optionGuage.series[2].data[0].value = (Math.random()*2).toFixed(2) - 0;
    //     optionGuage.series[3].data[0].value = (Math.random()*2).toFixed(2) - 0;
    //     myChartGuage.setOption(optionGuage,true);
    // },2000);;
    if (optionGuage && typeof optionGuage === "object") {
        myChartGuage.setOption(optionGuage, true);
    }
// <!-- 右侧栏仪表盘 结束 -->

// <!-- 右侧栏折线图 开始 -->

    var domLine = document.getElementById("dynamicLine");
    var myChartLine = echarts.init(domLine);
    var app = {};
    optionLine = null;
    function randomData() {
        now = new Date(+now + oneDay);
        value = value + Math.random() * 21 - 10;
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                Math.round(value)
            ]
        }
    }
    
    var dataLine = new Array();
    var now = +new Date(1997, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    var value = Math.random() * 1000;
    // for (var i = 0; i < 1000; i++) {
    //     data.push(randomData());
    // }
    
    optionLine = {
        title: {
            text: '历史速度'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                // var date = new Date(params.name);
                var data_tem = params.name.split(' ');
                return data_tem[3]+'-'+data_tem[1]+'-'+data_tem[2]+' '+data_tem[4]+' '+params.value[1]; 
                // return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                // return data.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'.'+date.getMinutes()+' '+params.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        dataZoom: [
            {   // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 0,      // 左边在 10% 的位置。
                end: 100,         // 右边在 60% 的位置。
                height: '5%',
                // zlevel:3
                // minSpan:8,
            },
            {   // 这个dataZoom组件，也控制x轴。
                type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                start: 0,      // 左边在 10% 的位置。
                end: 100         // 右边在 60% 的位置。
            }
        ],
        series: [{
            name: '数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: dataLine
        }]
    };
    
    // setInterval(function () {
    
    //     for (var i = 0; i < 5; i++) {
    //         data.shift();
    //         data.push(randomData());
    //     }
    
    //     myChartLine.setOption({
    //         series: [{
    //             data: data
    //         }]
    //     });
    // }, 1000);;
    if (optionLine && typeof optionLine === "object") {
        myChartLine.setOption(optionLine, true);
    }

// <!-- 右侧栏折线图 结束 -->




// <!-- 底部栏 -->


// <!-- Pie Start -->
    var domPie = document.getElementById("Pie");
    var myChartPie = echarts.init(domPie);
    var app = {};
    optionPie = null;
    app.title = '环形图';
    
    optionPie = {
        tooltip: {
            triggeron:'click',
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['活跃','休眠','充电','初始化','上电','未知']
            // data:['运行中','空闲中','低电量','离线','待维修']
            // tooltip: {
            //     triggeron:'click',
            //     trigger: 'item',
            //     formatter: "{b}: {c} ({d}%)"
            // }

        },
        series: [
            {
                name:'车辆状态',
                type:'pie',
                radius: ['35%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '110%',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data:[
                    {value:1, name:'活跃'},
                    {value:1, name:'休眠'},
                    {value:1, name:'充电'},
                    {value:1, name:'初始化'},
                    {value:1, name:'上电'},
                    {value:1, name:'未知'},
                ]
            }
        ]
    };
    ;
    if (optionPie && typeof optionPie === "object") {
        myChartPie.setOption(optionPie, true);
    }
// <!-- Pie End -->


// 层叠图开始
    var domStack = document.getElementById("Stack");
    var myChartStack = echarts.init(domStack);
    var app = {};
    optionStack = null;
    optionStack = {
        title: {
            text: '车辆使用情况'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            // data:['使用中','空闲中','低电量','离线','待维修']
            data:['活跃','休眠','充电','初始化','上电','未知']
        },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        grid: {
            // top: '15%',
            left: '3%',
            right: '4%',
            // bottom: '50px',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : new Array(),
                // data : ['','','','','','','', '']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        dataZoom: [
            {   // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 0,      // 左边在 10% 的位置。
                end: 100         // 右边在 60% 的位置。
            },
            {   // 这个dataZoom组件，也控制x轴。
                type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                start: 0,      // 左边在 10% 的位置。
                end: 100         // 右边在 60% 的位置。
            }
        ],
        series : [
            {
                name:'活跃',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data : new Array(),
                // data:[120, 132, 101, 134, 90, 230, 210,1000]
            },
            {
                name:'休眠',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data : new Array(),
                // data:[220, 182, 191, 234, 290, 330, 310, 1000]
            },
            {
                name:'充电',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data : new Array(),
                // data:[150, 232, 201, 154, 190, 330, 410, 1000]
            },
            {
                name:'初始化',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data : new Array(),
                // data:[150, 232, 201, 154, 190, 330, 410, 1000]
            },
            {
                name:'上电',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data : new Array(),
                // data:[150, 232, 201, 154, 190, 330, 410, 1000]
            },
            {
                name:'未知',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data : new Array(),
                // data:[150, 232, 201, 154, 190, 330, 410, 1000]
            },
            // {
            //     name:'离线',
            //     type:'line',
            //     stack: '总量',
            //     areaStyle: {normal: {}},
            //     data:[320, 332, 301, 334, 390, 330, 320]
            // },
            // {
            //     name:'待维修',
            //     type:'line',
            //     stack: '总量',
            //     label: {
            //         normal: {
            //             show: true,
            //             position: 'top'
            //         }
            //     },
            //     areaStyle: {normal: {}},
            //     data:[820, 932, 901, 934, 1290, 1330, 1320]
            // }
        ]
    };
    ;

    // initialStack();
    if (optionStack && typeof optionStack === "object") {
        myChartStack.setOption(optionStack, true);
    }

// 层叠图 结束


    window.onresize = function () {
        myChartPie.resize();
        myChartStack.resize();
        myChartGuage.resize();
        myChartLine.resize();
    }


// <!-- 绘制地图 -->

    // 绘制轨迹折线图
    function drawLine(prePoint, nxtPoint){
        console.log('prePoint: '+prePoint.lng+''+prePoint.lat);
        console.log('nxtPoint: '+nxtPoint.lng+''+nxtPoint.lat);

        // var sym = new BMap.Symbol
        // (
        //     BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, //百度预定义的 箭头方向向下的非闭合箭头
        //     {
        //         fillColor : '#0F0', //设置矢量图标的填充颜色。支持颜色常量字符串、十六进制、RGB、RGBA等格式
        //         fillOpacity : 1, //设置矢量图标填充透明度,范围0~1
        //         scale : 0.5, //设置矢量图标的缩放比例
        //         // rotation : 90, //设置矢量图标的旋转角度,参数为角度
        //         strokeColor : '#FFF', //设置矢量图标的线填充颜色,支持颜色常量字符串、十六进制、RGB、RGBA等格式
        //         strokeOpacity : 1, //设置矢量图标线的透明度,opacity范围0~1
        //         strokeWeight : 2, //旋设置线宽。如果此属性没有指定，则线宽跟scale数值相
        //     }
        // );

        // var iconSequence = new BMap.IconSequence
        // (
        //     sym, //symbol为符号样式
        //     '0%', //offset为符号相对于线起点的位置，取值可以是百分比也可以是像素位置，默认为"100%"
        //     '40%', //repeat为符号在线上重复显示的距离，可以是百分比也可以是距离值，同时设置repeat与offset时，以repeat为准
        //     false //fixedRotation设置图标的旋转角度是否与线走向一致，默认为true
        // );
        // var polyline = new BMap.Polyline(
        //     [
        //         prePoint,
        //         nxtPoint
        //     ],
        //     {
        //         icons : [iconSequence], //图标集合  **也是我之前没有实现样式改变的最大原因**
        //         strokeColor : '#0F0', //折线颜色 尽量与图标填充色保持一样
        //         strokeOpacity : 1, //折线的透明度，取值范围0 - 1
        //         strokeWeight : 5, //折线的宽度，以像素为单位
        //     }
        // );
        var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {    
            scale: 0.6,//图标缩放大小
            strokeColor:'#fff',//设置矢量图标的线填充颜色
            strokeWeight: '2',//设置线宽
        });
        var icons = new BMap.IconSequence(sy, '10', '30');
        var arr = new Array();
        arr.push(prePoint, nxtPoint)
        var polyline = new BMap.Polyline(arr, {
            enableEditing: false,//是否启用线编辑，默认为false
            enableClicking: true,//是否响应点击事件，默认为true
            icons:[icons],
            strokeWeight:'8',//折线的宽度，以像素为单位
            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
            strokeColor:"#18a45b" //折线颜色
        });
        map.addOverlay(polyline);
        console.log('drawnline finish');
    }

    // 绘制点（根据车辆状态选择图片颜色），并加入回调
    function drawMapPoint(data, type){
        // var myIcon = new BMap.Icon("./img/icon-green-small.gif", new BMap.Size(25, 25));
        for(var i = 0; i < data.length; ++i){
            
            var marker = new BMap.Marker(new BMap.Point(data[i][1], data[i][2]));
            marker.setIcon(iconArr[type]);
            var content = data[i][0];
            map.addOverlay(marker)
            if(needAnimation[type]) marker.setAnimation(BMAP_ANIMATION_DROP);//坠落动画
            addMouseHandler(content, marker);
        }
        needAnimation[type] = false;
    }

    function addMouseHandler(content,marker){
        marker.addEventListener("mouseover",function(e){
            this.getPosition();
            needUpdateMap = false;
            openInfo(content, e);
        });
        marker.addEventListener("mouseout",function(e){
            needUpdateMap = true;
        });
        marker.addEventListener("click",function(){ //必须要在外面套一个匿名函数，不然会直接执行，不知道为什么
            needUpdateMap = true;
            onClickOverlay((content.split(' '))[0]);
        });
    }

    function openInfo(content, e){
        var p=e.target;
        
        var opts = {
            // width : 50px,     // 信息窗口宽度
            // height: '10%',     // 信息窗口高度
            title : '车辆编号'  // 信息窗口标题
        }

        var point=new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts);
        map.openInfoWindow(infoWindow, point);
    }

    // // var data_info = [[121.447176,31.033731],[135.447176,35.033731],[115.447176,35.033731]];
    // var data_info = [[121.447176,31.033780,"car1"],[121.445009,31.030880,"car2"],[121.444695,31.027980,"car2"]];
    // function eConsole(param) {
    // 　　//param.dataIndex 获取当前点击索引，
    // // 　　console.log(param.dataIndex);
    //     map.clearOverlays();
    // 　　clickFunc(param.dataIndex);//执行点击效果
    // }
    // myChartPie.on("click", eConsole);
    
    // function addMouseHandler(content,marker, num){
    //     marker.addEventListener("mouseover",function(e){
            
    //         this.getPosition();
    //         openInfo(content, e);
    //         // console.log(num);
    //     });
    //     marker.addEventListener("click",function(){ //必须要在外面套一个匿名函数，不然会直接执行，不知道为什么
    //         onClickOverlay(num);
    //     });
    // }

    // function openInfo(content, e){
    //     // console.log("mouse on");
    //     var p=e.target;
        
    //     var opts = {
    //         // width : 50px,     // 信息窗口宽度
    //         // height: '10%',     // 信息窗口高度
    //         title : '车辆编号'  // 信息窗口标题
    //     }

        
    //     var point=new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    //     var infoWindow = new BMap.InfoWindow(content, opts);
    //     map.openInfoWindow(infoWindow, point);
    //     // console.log(content);
    // }

    // function clickFunc(carType){
    //     // console.log(data_info.length);
    //     var myIcon = new BMap.Icon("./img/icon-green-small.gif", new BMap.Size(25, 25));
    //     for(var i = 0; i < data_info.length; ++i){
            
    //         var marker = new BMap.Marker(new BMap.Point(data_info[i][0], data_info[i][1]));
    //         marker.setIcon(myIcon);
    //         var content = data_info[i][2];
    //         map.addOverlay(marker)
    //         addMouseHandler(content, marker, i);
    //     }
    // }
 


    // <!-- 网页启动 -->
    // initialStack();
    myChartPie.on("click", eConsole);
    backToBackground();
    requestCurrentTypeNum();
    backgroundRequest();
    // setInterval(function(){
    //     if(pageStale) return;
    //     requestCurrentTypeNum();
    // }, 12253 );
    setInterval(function(){
        // console.log('needUpdateMap: '+needUpdateMap);
        // console.log('mapLocked: '+mapLocked);

        if(pageStale) return;

        if(!needUpdateMap || mapLocked) return;
        if(!curSingleMode){
            // console.log('request background');
            // map.clearOverlays();
            backgroundRequest();
        }else{
            // console.log('request single');
            // requestSingleCarHistory();
            requestSingleCar();
        }
    }, 5000   );

    setInterval(function(){
        pageStale = true;
    }, 1800000);
</script>