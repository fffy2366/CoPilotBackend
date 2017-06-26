module.exports = {
    cookieSecret:'exambyfrank',
    cookieName:'exambyfrank',
    env:"dev",
    dev:{
        url:'http://localhost:3000',
        mysql: {
            host: 'localhost',

            user: 'root',
            password: '1234',
            database: 'images',
            connectionLimit: 10,
            charset: 'utf8_general_ci',
            supportBigNumbers: true
        },
        redis:{
            host:'127.0.0.1',
            port:6379,
            pass:'db2016'
        }
        
    },
    testing:{
        url:'http://180.76.143.82:3000',
        mysql: {
            host: '180.76.143.82',
            
        },
        redis:{
            host:'127.0.0.1',
            
        }        
    },
    prod:{
        url:'http://localhost:3000',
        mysql: {
            host: '127.0.0.1',
            
        },
        redis:{
            host:'127.0.0.1',
            port:6379,
            pass:'db2016'
        },
       
    }
};
