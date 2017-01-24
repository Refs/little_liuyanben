var express = require("express");
var db = require("./model/db")

var app = express();

//增加数据
app.get("/",function(req,res){
    db.insertOne("student",{"name":"xiaozhou","age":13,"hobby":"sing,sleep"},function(err,result){
        if(err){
            res.send(err);
            return;
        }
        res.send(result);
    })
})


// 查询数据
app.get("/du",function(req,res){
    // 这个页面接收一个名为page的 页面参数；
    var page = req.query.page;
    // 127.0.0.1:3000/du?page=3-------req.query一个对象，为每一个路由中的query string参数都分配一个属性。如果没有query string，它就是一个空对象，{}。
    db.find("student",{},{"pageamount":2,"page":page},function(err,result){
        if(err){
            res.send(err);
            return;
        }
        res.send(result);
    })
})

// 删除数据
app.get("/delete",function(req,res){
    var filterName = req.query.name;
    console.log(filterName);
    db.deleteMany("student",{"name":filterName},function(err,result){
        if(err){
            res.send(err);
            return;
        }
        res.send(result);
    })
})
// 地址栏输入：127.0.0.1/delete?name="xiaowang" 既可以删除 {"name":"xiaowang" **}的数据；ei

// 修改数据
app.get("/update",function(req,res){
    db.updateMany("student",{"name":"xiaoming"},{$set:{"name":"xiaoli"},$currentDate:{
        "lastModified":true
    }},function(err,result){
        if(err){
            res.send(err);
            return;
        }
        res.send(result);
    })
})

app.listen(3000);