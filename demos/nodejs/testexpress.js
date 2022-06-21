// 比较一下express()和express.Router()的区别
var express = require('express');
var app = express(); // 一般可以理解成一个完整的App，可以挂载多个router
var router = express.Router(); // 相当于一个mini-App，可以配置多个route，必须要挂载在App上才能使用
// 总会被调用
router.use(function (req, res, next) {
    // 业务逻辑，类似一个中间件
    console.log("router.use");
    // 一个简单的日志打印中间件，所有的请求首先会经过这个中间件
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});
// 这个中间件只会匹配到'/bar'开头的路径
router.use('/bar', function (req, res, next) {
    // ... /bar 下的一些逻辑处理 ...
    console.log("router.use bar");
    next();
});
// 自定义 router.param() 处理器
router.param(function (param, option) {
    return function (req, res, next, val) {
        if (val == option) {
            next();
        } else {
            res.sendStatus(403);
        }
    }
});
// 使用自定义的 router.param()
router.param('id', 1337);

// 捕获路由触发器
router.get('/user/:id', function (req, res) {
    res.send('OK');
});
router.get('/', function (req, res, next) {
    console.log("init");
    let data = {
        'a': 100,
        'b': 200,
        'c': 300
    };
    res.send(JSON.stringify(data));
});
// 捕获 /events 路径的 GET 请求
router.get('/events', function (req, res, next) {
    console.log("get events");
    let data = {
        'a': 1,
        'b': 2,
        'c': 3
    };
    res.send(JSON.stringify(data));
});
// 使用 /test 作为默认URL
app.use("/test", router);

app.listen(3000, function () {
    console.log('Server is Ready');
});