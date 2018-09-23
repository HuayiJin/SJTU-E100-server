var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup  更换模板引擎
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//注释掉默认的，自己手动修改默认引擎;
var nunjucks = require('nunjucks');
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  watch: true
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('views/error');
  // res.json({ message: err.message, error: err });
  res.render('error.html',{error:err});//根据错误状态码渲染不同模板数据

  
  // res.status(err.status);//http错误状态码
});

module.exports = app;
