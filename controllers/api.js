var settings = require('../config/settings');
var logger = require('../config/Logger.js');
var Auth = require('../services/auth') ;
var StringUtils = require('../components/StringUtils') ;
var crypto = require('crypto') ;
var redis   = require('redis');

var redis_config = settings[settings.env].redis ;
var client  = redis.createClient(redis_config.port, redis_config.host);
client.setMaxListeners(0);
client.auth(redis_config.pass, function(){});

client.on('connect', function() {
    //client.publish("test","test") ;

    logger.info('connected');
});
client.on("error", function(error) {
    logger.info(error);
});

Api = {} ;
var _md5 = function(str){
  var md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
}
Api.login = (req,res)=>{
  logger.info("req.sessionId:"+req.sessionID) ;
  req.rawBody = '';
  var json = {};
  //req.setEncoding('utf8');
  logger.info(req.body) ;
  var deal = function(rawBody){
    var bodyObj = JSON.parse(rawBody) ;
    logger.info(bodyObj) ;
    if(!bodyObj.username || !bodyObj.password){
      res.send({"error":{"name":"用户名或密码不能为空"}}) ;
      return ;
    }
    if(bodyObj.username == "admin" && bodyObj.password == "123456"){      
      var authKey = _md5(req.sessionID+bodyObj.username+bodyObj.password) ;
      // req.session.user = {"name":bodyObj.username}
      // req.session.token = authKey ;
      client.set('copilot:'+authKey,JSON.stringify({"name":bodyObj.username})) ;
      client.expire('copilot:'+authKey, 1800);
      logger.info("req.session.token:"+req.session.token) ;
      res.send({
        "user":{
        	"name":bodyObj.username
        },
        "sessionID":req.sessionID,
        "token":authKey,
        "redirect":"/"
      }) ;      
    }else{
      res.send({"error":{"name":"用户名或密码错误"}}) ;
    }
  } ;
  
  if(req.body&&!StringUtils.isEmpty(req.body)){
      req.rawBody = JSON.stringify(req.body) ;
      deal(req.rawBody) ;
  }else{
      req.on('data', function (chunk) {
          req.rawBody += chunk;
      });        
      req.on('end', function () {
          deal(req.rawBody) ;
      }) ;
  }
} ;

Api.userinfo = (req,res)=>{
	Auth.check(req,res,function(err,data){
		res.send(data) ;
	}) ;
}
module.exports = Api