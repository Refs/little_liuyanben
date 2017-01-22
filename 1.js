// 简单的数据库连接，以及插入操作；

var express = require("express");
var app = express();
var MongoClient = require("mongodb").MongoClient;
var db = require("./model/db");

// app.get("/",function(req,res){
// //    
//     var uri = "mongodb://localhost:27017/itcast";
//     MongoClient.connect(uri,function(err,db){
//         if(err){
//             console.log(err);
//             return;
//         }
//         console.log("数据库连接成功");
//         db.collection("student").insertOne({
//             "name":"xiaoming",
//             "age":13,
//             "habby":"睡觉"
//         },function(err,result){
//             res.send(result);
//             db.close();
//         })
//     })
// })

app.get("/",function(req,res){ 

    db.insertOne("student",{"name":"xiaohua","age":"87"},function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
    })}

)

app.listen(3000);
// 一个函数，只要说 其之后还要做什么，立马就应该会意到“其应该有一个参数”callback;
// 调用函数是，传入的回调函数的参数，要能承接下级函数“上传的数据” 遇到错误 callback(err,null);正确执行callback(null,data);
 
// 上级要寻找什么，肯定是要吩咐下级去做；
// 下级取得了一点小小的成果，就马上向上级邀功，还喜欢报错，证明自己聪明；