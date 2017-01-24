var express = require("express");
var db = require("./model/db");

var app = express();

app.set("view engine","ejs");
app.use(express.static("./public"));

//显示留言form
app.get("/",function(req,res){
    res.render("index")    
})

//接收并处理留言

app.listen(3000);