var express = require('express');
var mysql = require('mysql');
var router = express.Router();


var db = mysql.createPool({ host: 'localhost', user: 'root', password: 'mysqlpwd', database: 'nodedb' });

// module.exports=function(router){
//     var router=express.Router();
//     //注册操作
//     // router.post('/',function(req,res,next){
//     //     var data=req.body;
//     //    res.render('regist', { title: 'regist' });

//     // })
//     router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// }




// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

router.get('/', function (req, res, next) {
    res.send('respond with aaaa resource');
});
router.post('/register', function (req, res, next) {
    var data = req.body;
    var mobile = data.mobile;
    var password = data.password;
    var select = `select mobile from user where mobile=${mobile}`;
    db.query(select, (err, data) => {
        if (err) {
            res.send("查询失败: " + err);
        } else {
            console.log(data)
            if (data.length > 0) {
                res.send({ code: 2, tip: '手机号已注册' });
            } else {
                var query = `insert into user(mobile,password) values(${mobile},'${password}')`;
                db.query(query, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.send("新增失败" + err, { code: 2 });
                    } else {
                        res.send({ code: 1, tip: '注册成功,返回登录' })
                    }
                });

            }
        }
    })
    // console.log('selectdata------>',selectdata)

    // var query = "INSERT INTO user(mobile,password) VALUES(" + data.mobile + "," + data.password + ")";
});
router.post('/login', function (req, res, next) {
    var data = req.body;
    var mobile = data.mobile;
    var password = data.password;
    var select = `select * from user where mobile=${mobile}`;
    db.query(select, (err, data) => {
        if (err) {
            res.send("登录失败：" + err);
        } else {
            console.log(data)
            if (data.length == 0) {
                res.send({ code: 2, tip: '该手机号未注册' });
            } else {
                if (data[0].password == password) {
                    res.send({ code: 1, tip: '登录成功' })
                } else {
                    res.send({code:2,tip:'手机号或密码错误'})
                }
            }
        }
    })
});

router.post('/resetpsd',function(req,res,next){
    var data = req.body;
    var mobile = data.mobile;
    var password = data.password;
    var select = `select * from user where mobile=${mobile}`;
    db.query(select, (err, data) => {
        if (err) {
            res.send("登录失败：" + err);
        } else {
            console.log(data)
            if (data.length == 0) {
                res.send({ code: 2, tip: '该手机号未注册' });
            } else {
                var update = `update user set  password='${password}' where mobile=${mobile}`;
                db.query(update,(err,data)=>{
                    if(err){
                        res.send("重置密码失败:"+err);
                    }else{
                        res.send({code:1,tip:'密码重置成功'});
                    }
                })
            }
        }
    })
})

module.exports = router;

