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


Auth = {} ;
Auth.check = (req, res, callback) => {
	let sessionId = req.get('sessionId') ;
	let token = req.get('token') ;	
	logger.info("token:"+token) ;
	// 验证权限
	if(!sessionId || !token){
		res.send({"error":{"name":"非法请求"}}) ;
		return ;
	}
	client.get('copilot:'+token,function(err,_res) {
	    logger.info(_res); // => 'bar'
	    if(!_res){
	    	callback(true,{"error":{"name":"登录失效"}}) ;
	    }else{
	    	// 延长登录时效
	    	client.expire('copilot:'+token, 1800);
	    	callback(null,{"data":{"user":_res}}) ;
	    }
	});
} ;
module.exports = Auth ;