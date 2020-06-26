var express = require('express');
var router = express.Router();
//引入数据库包

var query = require('../api/query');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.query.password == 'sjtu123'){
      res.render('index.html', { title: 'ExpressTitle' });
      
    }else{
    res.render('login.html', { title: 'ExpressTitle' });
    }
});

router.get('/login', function(req, res, next) {
  if(req.query.password == 'sjtu123'){
    res.status(200).send({token:'hello'});
  }else{
    res.status(666).send('wrong');
  }
});

router.get('/home', function(req, res, next) {
  if(req.query.token == 'hello'){
    res.render('index.html', { title: 'ExpressTitle' });
  }else{
    res.render('error.html', { title: 'ExpressTitle' });
  }
});

router.get('/query/single/info_java', query.get_single_info_java);


/*============================全局============================*/

/**请求所有车辆的当前所有数据(测试用)
 * res = [{
 *      car_VIN = ...
 *      create_time = ...
 *      ...
 * },{}...]
 */
router.get('/query/all/all', query.get_all_all);


/**请求所有车辆的历史状态（计算多级折线图）
 * 示例 http://202.120.60.31:3000/query/history/status?limit=5000000
 * 参数 limit = [1,1000] -> 按分钟为单位，距今的分钟数 默认为100
 * res = [{
 *      car_VIN,
 *      latest_info:{
 *          create_time:
 *          vehicle_operating_mode:
 *          }
 *      info:[{}{}{}...]
 * },{}...]
 */
router.get('/query/history/status', query.get_history_status);


/**请求所有(在线、离线、充电)车辆的最新位置
 * res = [{
 *      car_VIN = ...
 *      create_time = ...
 *      longitude = 121.425
 *      latitude = 31.0198
 *      vehicle_operating_mode
 * },{}...]
 */
router.get('/query/all/location', query.get_all_location);


/**2020年6月新增，批量请求所有车辆的最新位置
 * res = [{
 *      VIN = ...
 *      collectTime = ...
 *      longitude = 121.425
 *      latitude = 31.0198
 *      angle = ??? 大部分情况为空，不一定好用
 * },{}...]
 */
router.get('/query/all/location/batch', query.get_all_location_batch);


/**2020年6月新增，请求某一时刻的所有车辆的位置
 * 示例 http://202.120.60.31:3000/query/all/location/batch/time?timestamp=1593187422
 * 参数 timestamp = 1593187422
 * res = [{
 *      VIN = ...
 *      collectTime = ...
 *      longitude = 121.425
 *      latitude = 31.0198
 *      angle = ??? 大部分情况为空，不一定好用
 * },{}...]
 */
router.get('/query/all/location/batch/time', query.get_all_location_batch_time);


/**请求所有车辆的当前状态（用于计算饼图）
 * res = [{
 *      car_VIN = ...
 *      create_time = ...
 *      vehicle_operating_mode = ...
 * },{}...]
 */
router.get('/query/all/status', query.get_all_status);

/*============================单车============================*/

/**请求单车当前所有信息
 * 参数 car_VIN = "LXXXXXXXXXXXXXXXXX"
 * res = {
 *      velocity = 20
 *      drive_motor_rpm = 30
 *      ...
 * }
 */
router.get('/query/single/info', query.get_single_info);

/**请求单车某项历史记录
 * 参数 car_VIN = "LXXXXXXXXXXXXXXXXX"
 * 参数 type = {velocity, drive_motor_rpm, drive_motor_temperature ...}
 * 参数 length = [1,1000] -> 按分钟为单位，距今的分钟数 默认为100
 * res = [{
 *      create_time = ...
 *      velocity = 20
 *      drive_motor_rpm = 30
 *      ...
 * },{}...]
 */
router.get('/query/single/history', query.get_single_history);

/**请求单车历史轨迹
 * 参数 car_VIN = "LXXXXXXXXXXXXXXXXX"
 * 参数 length = [1,1000] -> 按分钟为单位，距今的分钟数 默认为100
 * res = [{
 *      create_time = ...
 *      longitude = 20
 *      latitude = 30
 *      ...
 * },{}...]
 */
router.get('/query/single/route', query.get_single_route);


module.exports = router;