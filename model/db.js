// 此模块中，封装了所有对数据库的常用操作；

var MongoClient = require("mongodb").MongoClient;

// 不管对数据库进行什么样的操作，都需要先链接数据库，所以我们可以将链接数据库，封装成为一个内部函数；
 function _connectDB(callback){
     var url = "mongodb://localhost:27017/itcast";

     MongoClient.connect(url,function(err,db){
         if(err){
             callback(err,null); //错误上传；
             return;
         }
         callback(null,db); //数据上传；
     })
 }
//  因为链接数据库之后还要去做其它事情，所以此处函数要有一个接收回调函数的参数callback;

exports.insertOne = function(collection,json,callback){
    _connectDB(function(err,db){
        if(err){
            console.log(err);
            return;
        }
        db.collection(collection).insertOne(json,function(err,result){
            if(err){
                console.log(err);
                return;
            }
            callback(null,result);
            db.close();
        })
    })
}
