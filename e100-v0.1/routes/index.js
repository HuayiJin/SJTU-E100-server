var express = require('express');
var router = express.Router();
//引入数据库包

var query = require('../api/query');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'ExpressTitle' });
});


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
 * 参数 limit = [1,1000] -> 按分钟为单位，距今的分钟数
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
 *      speed = 20
 *      drive_motor_rpm = 30
 *      ...
 * }
 */
router.get('/query/single/info', query.get_single_info);

/**请求单车某项历史记录
 * 参数 car_VIN = "LXXXXXXXXXXXXXXXXX"
 * 参数 type = {speed, drive_motor_rpm, drive_motor_temperature ...}
 * 参数 length = [1,1000]
 * res = [{
 *      create_time = ...
 *      speed = 20
 *      drive_motor_rpm = 30
 *      ...
 * },{}...]
 */
router.get('/query/single/history', query.get_single_history);

/**请求单车历史轨迹
 * 参数 car_VIN = "LXXXXXXXXXXXXXXXXX"
 * 参数 length = [1,1000]
 * res = [{
 *      create_time = ...
 *      longitude = 20
 *      latitude = 30
 *      ...
 * },{}...]
 */
router.get('/query/single/route', query.get_single_route);


module.exports = router;