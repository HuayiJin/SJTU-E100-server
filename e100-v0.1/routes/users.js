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
router.get(TESTPATH + '/add' + '/register', function(req,res){res.render('addregister.html')});
router.post(TESTPATH + '/add' + '/register', vehicles.addUser);

router.get(TESTPATH + '/add' + '/runtime', function(req,res){res.render('addruntime.html')});
router.post(TESTPATH + '/add' + '/runtime', vehicles.addRuntime);

router.get(TESTPATH + '/add' + '/battery', function(req,res){res.render('addbattery.html')});
router.post(TESTPATH + '/add' + '/battery', vehicles.addBattery);

router.get(TESTPATH + '/add' + '/alert', function(req,res){res.render('addalert.html')});
router.post(TESTPATH + '/add' + '/alert', vehicles.addAlert);

router.get(TESTPATH + '/add' + '/other', function(req,res){res.render('addother.html')});
router.post(TESTPATH + '/add' + '/other', vehicles.addOther);

/**
 * 删
 */
router.get(TESTPATH + '/delete', vehicles.deleteUser);
/**
 * 修改
 */
router.get(TESTPATH + '/update', vehicles.getVehicle);
router.post(TESTPATH + '/update', vehicles.updateVehicle);
/**
 * 查询
 */
router.post(TESTPATH + '/search', vehicles.searchVehicle);

module.exports = router;