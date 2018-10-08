var express = require('express');
var router = express.Router();
//引入数据库包
var TESTPATH = '/TEST';
var PATH = '';
var vehicles = require('../api/vehicles');

/**
 * 查询列表页
 */
router.get(PATH, vehicles.getVehicles);
router.get(PATH + TESTPATH, vehicles.getVehicles);

/**
 * 新增页面跳转
 */

router.get(PATH + '/add', vehicles.getAddpage);
router.get(PATH + '/add' + '/register', function(req,res){res.render('addregister.html')});
router.post(PATH + '/add' + '/register', vehicles.addUser);

router.get(PATH + '/add' + '/runtime', function(req,res){res.render('addruntime.html')});
router.post(PATH + '/add' + '/runtime', vehicles.addRuntime);

router.get(PATH + '/add' + '/battery', function(req,res){res.render('addbattery.html')});
router.post(PATH + '/add' + '/battery', vehicles.addBattery);

router.get(PATH + '/add' + '/alert', function(req,res){res.render('addalert.html')});
router.post(PATH + '/add' + '/alert', vehicles.addAlert);

router.get(PATH + '/add' + '/other', function(req,res){res.render('addother.html')});
router.post(PATH + '/add' + '/other', vehicles.addOther);


router.get(PATH + TESTPATH + '/add', vehicles.getAddpage);
router.get(PATH + TESTPATH + '/add' + '/register', function(req,res){res.render('addregister.html')});
router.post(PATH + TESTPATH + '/add' + '/register', vehicles.addUser);

router.get(PATH + TESTPATH + '/add' + '/runtime', function(req,res){res.render('addruntime.html')});
router.post(PATH + TESTPATH + '/add' + '/runtime', vehicles.addRuntime);

router.get(PATH + TESTPATH + '/add' + '/battery', function(req,res){res.render('addbattery.html')});
router.post(PATH + TESTPATH + '/add' + '/battery', vehicles.addBattery);

router.get(PATH + TESTPATH + '/add' + '/alert', function(req,res){res.render('addalert.html')});
router.post(PATH + TESTPATH + '/add' + '/alert', vehicles.addAlert);

router.get(PATH + TESTPATH + '/add' + '/other', function(req,res){res.render('addother.html')});
router.post(PATH + TESTPATH + '/add' + '/other', vehicles.addOther);

/**
 * 删
 */
router.get(PATH + '/delete', vehicles.deleteUser);
router.get(PATH + TESTPATH + '/delete', vehicles.deleteUser);

/**
 * 修改
 */
router.get(PATH + '/update', vehicles.getVehicle);
router.post(PATH + '/update', vehicles.updateVehicle);

router.get(PATH + TESTPATH + '/update', vehicles.getVehicle);
router.post(PATH + TESTPATH + '/update', vehicles.updateVehicle);
/**
 * 查询
 */
router.get(PATH + '/search/register', vehicles.searchVehicleRegister);
router.get(PATH + '/search/runtime', vehicles.searchVehicleRuntime);
router.get(PATH + '/search/battery', vehicles.searchVehicleBattery);
router.get(PATH + '/search/alert', vehicles.searchVehicleAlert);

router.get(PATH + TESTPATH + '/search/register', vehicles.searchVehicleRegister);
router.get(PATH + TESTPATH + '/search/history', vehicles.searchVehicleRuntime);
router.get(PATH + TESTPATH + '/search/history', vehicles.searchVehicleBattery);
router.get(PATH + TESTPATH + '/search/history', vehicles.searchVehicleAlert);

module.exports = router;