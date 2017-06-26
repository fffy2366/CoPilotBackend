var express = require('express');
var router = express.Router();
var settings = require('../config/settings');
var crypto = require('crypto') ;
var Api = require('../controllers/api') ;

var resHeader = (res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  return res
}
/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.test = "test" ;
  console.log(req.sessionID) ;
  console.log(req.session) ;
  console.log(req.session.test) ;
  console.log(req.cookies[settings['cookieName']]) ;

  res.render('index', { title: 'Express' });
});
/**
 * 登录
 */
router.route('/api/login').post(Api.login) ;
/**
 * 用户信息
 */
router.get('/api/user',Api.userinfo) ;
module.exports = router;
