var express = require('express');
var router = express.Router();
//引入数据库包
var TESTPATH = '/TEST';
var vehicles = require('../api/vehicles');

/**
 * 查询列表页
 */
router.get(TESTPATH, vehicles.getVehicles);

/**
 * 新增页面跳转
 */

router.get(TESTPATH + '/add', vehicles.getAddpage);
router.post(TESTPATH + '/add', vehicles.addUser);

/**
 * 删
 */
router.get(TESTPATH + '/delete/:id', vehicles.deleteUser);
/**
 * 修改
 */
router.get(TESTPATH + '/toUpdate/:id', vehicles.getVehicle);
router.post(TESTPATH + '/update', vehicles.updateVehicle);
/**
 * 查询
 */
router.post(TESTPATH + '/search', vehicles.searchVehicle);

module.exports = router;