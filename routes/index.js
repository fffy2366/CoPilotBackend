var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  var username = req.body.username ;
  var password = req.body.password ;
  console.log("username:"+username) ;
  console.log("password:"+password) ;
  res.send({"user":{"id":"1","name":"liangcuntu"},"token":"xxxxx","redirect":"/"}) ;
  //res.render('index', { title: 'Express' });
});



module.exports = router;
