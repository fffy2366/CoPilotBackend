var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login',function(req, res, next) {
  var username = req.body.username ;
  var password = req.body.password ;
  console.log("username:"+username) ;
  console.log("password:"+password) ;
  res.send({"user":{"id":"1","name":"liangcuntu"},"token":"xxxxx","redirect":"/"}) ;
  //res.render('index', { title: 'Express' });
});



module.exports = router;
