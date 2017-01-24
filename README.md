学会利用README.md做笔记记录，与代码托管，实现的最终效果，应与**API文档**保持一致；

版本库利用git来控制，而“思维路线（走出迷宫的路线）”则用README.md来控制；整个项目流程，都只是使用一个README,但将使用多个版本库；库与库之间的联系与描述都放到了，README文档中；（版本库有多个，看起来很混乱，但引导文件就只有一个，看起来一目了然）

两个名词：DAO mongoose

## mongodb DAO层 函数封装

### 数据库的链接

> 数据库的CRUD（增删改查）以及其它的操作，都是以先链接数据库为前提，然后再对数据库，进行一系列的操作；所以我们此处，将数据库的链接函数封装成为一个内部函数_connectDB
```js
	 //./model/db.js中
	 var MongoClient = require("mongodb").MongoClient;

	 function _connectDB(callback){
	     var url = "mongodb://localhost:27017/itcast";

	     MongoClient.connect(url,function(err,db){
	         if(err){
	             callback(err,null); 
	             return;
	         }
	         callback(null,db); //数据上传；
	     })
	 }
	//  因为链接数据库之后还要去做其它事情，所以此处函数要有一个接收回调函数的参数callback;

```

>其中数据库的连接可以创建一个配置文件来，来配置

```js 
    //创建配置文件
    //./seeting.js中
    model.exports = {
        "dburl" : "mongodb://localhost:27017/itcast"
    }
    //利用model.exports的暴露方式，可以将自身暴露，而不是暴露自身的一部分；
```

```js
	 //./model/db.js中
     var setting = require(../setting.js);
     //引入配置文件；
	 var MongoClient = require("mongodb").MongoClient;

	 function _connectDB(callback){
	     var url = seeting.dburl;

	     MongoClient.connect(url,function(err,db){
	         if(err){
	             callback(err,null); 
	             return;
	         }
	         callback(null,db); 
	     })
	 }

```
   
