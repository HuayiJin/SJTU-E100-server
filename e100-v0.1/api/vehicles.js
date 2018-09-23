var express = require('express');
//引入数据库包
var db = require("./db.js");


/**
 * 查询列表页
 */
exports.getVehicles = function (req, res, next) {
    db.query('select * from userinfo', function (err, rows) {
    console.log('==========');
        if (err) {
            res.render('users.html', {title: 'Express', datas: []});  // this renders "views/users.html"
        } else {
            res.render('users.html', {title: 'Express', datas: rows});
        }
    })
};

/**
 * 新增页面跳转
 */

exports.getAddpage = function (req, res) {
    res.render('add.html');
};
exports.add
router.post('/add', function (req, res) {
    var name = req.body.name;
    var age = req.body.age;
    db.query("insert into userinfo(name,age) values('" + name + "'," + age + ")", function (err, rows) {
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.redirect('/users');
        }
    })
});

/**
 * 删
 */
router.get('/del/:id', function (req, res) {
    var id = req.params.id;
    db.query("delete from userinfo where id=" + id, function (err, rows) {
        if (err) {
            res.end('删除失败：' + err)
        } else {
            res.redirect('/users')
        }
    });
});
/**
 * 修改
 */
router.get('/toUpdate/:id', function (req, res) {
    var id = req.params.id;
    db.query("select * from userinfo where id=" + id, function (err, rows) {
        if (err) {
            res.end('修改页面跳转失败：' + err);
        } else {
            res.render("update.html", {datas: rows});       //直接跳转
        }
    });
});
router.post('/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var age = req.body.age;
    db.query("update userinfo set name='" + name + "',age='" + age + "' where id=" + id, function (err, rows) {
        if (err) {
            res.end('修改失败：' + err);
        } else {
            res.redirect('/users');
        }
    });
});
/**
 * 查询
 */
router.post('/search', function (req, res) {
    var name = req.body.s_name;
    var age = req.body.s_age;
  console.log(name, age);
    var sql = "select * from userinfo";

    if (name) {
        sql += " and name='" + name + "' ";
    }

    if (age) {
        sql += " and age=" + age + " ";
    }
    sql = sql.replace("and","where");
    db.query(sql, function (err, rows) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.render("users.html", {title: 'Expresstitle', datas: rows, s_name: name, s_age: age});
        }
    });
});


module.exports = router;
