var express = require("express");
var formidable = require("formidable");
var db = require("./model/db");

var app = express();

app.set("view engine","ejs");
app.use(express.static("./public"));

//显示留言form
app.get("/",function(req,res){
    res.render("index")    
})

// ajax请求的路由
app.get("/du",function(req,res){
    db.find("liuyan",{},{"sort":{"shijian":-1}},function(err,result){
        if(err){
            console.log(err);
            res.json(-1);
            return;
        }
        res.json({"result":result});
    })
})

//接收并处理留言，接收的是post请求，node在处理post请求时，运用的是formidable插件
app.post("/tijiao",function(req,res){
    var form = new formidable.IncomingForm();
 
    form.parse(req, function(err, fields, files) {
      db.insertOne("liuyan",{"xingming":fields.name,"liuyan":fields.liuyan,"shijian":new Date()},function(err,result){
          if(err){
              res.json({"result":-1});//此处返回的"-1"是给ajax看的；
          }
          res.json({"result":1});
      })
    });

})

app.get("/shanchu",function(req,res){
    db.deleteMany("liuyan",{},function(err,result){
        if(err){
            res.send(err);
            return;
        }
        res.send(result);
    })
})

app.listen(3000);