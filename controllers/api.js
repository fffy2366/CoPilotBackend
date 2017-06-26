var settings = require('../config/settings');
var logger = require('../config/Logger.js');

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
Api.login = (req,res,callback)=>{
  console.log("req.sessionId:"+req.sessionID) ;
  req.rawBody = '';
  var json = {};
  //req.setEncoding('utf8');
  console.log(req.body) ;
  var deal = function(rawBody){
    console.log("type:") ;
    console.log(typeof rawBody) ;
    var bodyObj = JSON.parse(rawBody) ;
    console.log(bodyObj) ;
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
      console.log("req.session.token:"+req.session.token) ;
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
  function isEmpty(obj){
    for (var name in obj){
        return false;
    }
    return true;
  };
  if(req.body&&!isEmpty(req.body)){
      req.rawBody = JSON.stringify(req.body) ;
      deal(req.rawBody) ;
  }else{
      req.on('data', function (chunk) {
          //console.log("chunk:") ;
          //console.log(chunk) ;
          req.rawBody += chunk;
      });        
      req.on('end', function () {
          deal(req.rawBody) ;
      }) ;
  }
}

Api.userinfo = (req,res,callback)=>{
	let sessionId = req.get('sessionId') ;
	let token = req.get('token') ;	
	console.log("token:"+token) ;
	//验证权限
	if(!sessionId || !token){
		res.send({"error":{"name":"非法请求"}}) ;
		return ;
	}
	client.get('copilot:'+token,function(err,_res) {
	    console.log(_res); // => 'bar'
	    if(!_res){
	    	res.send({"error":{"name":"登录失效"}}) ;
	    }else{
	    	res.send({"data":{"user":_res}}) ;
	    }
	});
	
	
}
module.exports = Api