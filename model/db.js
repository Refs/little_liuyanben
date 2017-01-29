// 此模块中，封装了所有对数据库的常用操作；
var setting = require("./../setting");
var MongoClient = require("mongodb").MongoClient;

// 不管对数据库进行什么样的操作，都需要先链接数据库，所以我们可以将链接数据库，封装成为一个内部函数；
 function _connectDB(callback){
     var url = setting.dburl;

     MongoClient.connect(url,function(err,db){
         if(err){
             callback(err,null); //错误上传；  底层函数不负责错误或者数据处理，只负责上传；
             return;
         }
         callback(null,db); //数据上传；
     })
 }
//  因为链接数据库之后还要去做其它事情，所以此处函数要有一个接收回调函数的参数callback;

//插入数据 
exports.insertOne = function(collectionName,json,callback){
    _connectDB(function(err,db){
        if(err){
            callback(err,null);
            // console.log(err); 这种写法是错误的，因为此层函数，并非是顶层函数，不负责错误处理，而只负责错误上传；
            db.close();
            return;
        }
        db.collection(collectionName).insertOne(json,function(err,result){
            if(err){
                // console.log(err);
                callback(err,null);
                db.close();
                return;
            }
            callback(null,result);
            db.close();
        })
    })
}

/** -------------------------------------

// 查找数据  最基本的雏形

//向外暴露一个查找函数，函数要有三个参数：1.要查找的集合。2.查找条件。3.查找结果上传，回调；
exports.find = function(collectionName,json,callback){
    //调用数据库连接函数,
    _connectDB(function(err,db){
        if(err){
            callback(err,null);  //将_connectDB函数中报的错误，再接着向上传，而不处理，因为底层函数没有处理错误的权限；之后上传数据的权限；
            return;
        }
        var result = []; //结果数组

        var cursor = db.collection(collectionName).find(json);
        // find(query):Creates a cursor for a query that can be used to iterate over results from MongoDB
        // 通俗的说,游标不是查询结果,可以理解为数据在遍历过程中的内部指针,其返回的是一个资源,或者说数据读取接口. 客户端通过对游标进行一些设置就能对查询结果进行有效地控制，如可以限制查询得到的结果数量、跳过部分结果、或对结果集按任意键进行排序等！

        cursor.each(function(err,doc){
            if(err){
                callback(err,null);
                return;
            }
            if(doc != null){
                result.push(doc);
            }else{
                callback(null,result);//将结果数组返回，前台迭代起来就比较方便；
                db.close(); //数据库的开闭都在，底层函数中；
            }
        })

    })
}

----------------------------------**/
/** 

//为查找数据，增加分页的功能； 功能是通过控制cursor而实现的；游标不是查询结果,可以理解为数据在遍历过程中的内部指针,其返回的是一个资源,或者说数据读取接口. 客户端通过对游标进行一些设置就能对查询结果进行有效地控制，如可以限制查询得到的结果数量、跳过部分结果、或对结果集按任意键进行排序等！

exports.find = function(collectionName,json,args,callback){
    // 增加一个接口参数args用以承接，上级函数传入的分页条件；如：{"pageamount":"10","page":"1"} pageamount:每页分几条，page:当前为第几页；
    _connectDB(function(err,db){
        if (err){
            callback(err,null);
            return;
        }
        
        var result = [];

        //每页的条数； 
        var pageamount = parseInt(args.pageamount);

        // 应该省略的条数；
        var skipNumber = parseInt(args.page*args.pageamount);
        // 之所以要将此处拉出来，单写，是因为skip与limit要求的参数，都必须是整数；

        var cursor = db.collection(collectionName).find(json).limit(pageamount).skip(skipNumber);
        cursor.each(function(err,doc){
            if(err){
                callback(err,null);
                return;
            }
            if(doc != null){
                result.push(doc);
            }else{
                callback(null,result);
                db.close();
            }

        })
    })
}
*/

// 查找--分页--函数重载；

// 从语言角度来说，javascript不支持函数重载，不能够定义同样的函数然后通过编译器去根据不同的参数执行不同的函数。

// 此处函数实现重载就是：函数可以接收分页条件，也可以不接收分页条件，也就是说查询函数既可以接收三个参数：function(collectionName,json,callback),也可以去接收4个参数：function(collectionName,json,args,callback)两种不同的参数类型，有同样一个函数去实现；

exports.find = function(collectionName,json,C,D){
    if(arguments.length == 3){
        var callback = C;
        var pageamount = 0;
        var skipNumber = 0;
        var sort = {};
    }else if(arguments.length == 4){
        var args = C;
        var callback = D;
        var pageamount = parseInt(args.pageamount) || 0;
        var skipNumber = parseInt(args.page*args.pageamount) || 0;
        var sort = args.sort || {};
    }else{
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        
    }
    _connectDB(function(err,db){
        if (err){
            callback(err,null);
            db.close();//上传错误后，也应将数据库关闭；
            return;
        }
     
        var result = [];

        var cursor = db.collection(collectionName).find(json).limit(pageamount).skip(skipNumber).sort(sort);
        cursor.each(function(err,doc){
            if(err){
                callback(err,null);
                db.close();
                return;
            }
            if(doc != null){
                result.push(doc);
            }else{
                callback(null,result);
                db.close();
            }

        })
    })
}

//删除数据

exports.deleteMany = function(collectionName,json,callback){
    _connectDB(function(err,db){
        if(err){
            callback(err,null);
            db.close();
            return;
        }
        db.collection(collectionName).deleteMany(json,function(err,result){
            if(err){
                callback(err,null);
                db.close();//此处关闭数据库，最容易忘掉；
                return;
            }
            callback(null,result);
            db.close();
        })
    })
}

// 改变数据

exports.updateMany = function(collectionName,json1,json2,callback){
    // json1 为查询条件，json2为配置数据，有两种形式：1.{$set:{"name":"xiaoming"},$currentDate:{"lastmodified":true}};配置搜索结果数据的name属性为xiaoming; 2.{"name":"xiaoming"}直接将匹配数据，改成该json;
    _connectDB(function(err,db){
        if(err){
            callback(err,null);
            db.close();
            return;
        }
        db.collection(collectionName).updateMany(json1,json2,function(err,result){
            if(err){
                callback(err,null);
                db.close();
                return;
            }
            callback(null,result);
            db.close();
        })
    })
}

//得到集合中document的总数量
exports.count = function(collectionName,json,callback){//上级在调动自己做某件事的时候，需要要求上级提供资源或数据，没有这些数据自己没法干活；同时要留有接口，区接收这些数据；如本上级在吩咐的时候，要指明查那个集合，刷选条件，以及结果向哪里放，三个事；
    _connectDB(function(err,db){
        if(err){
            callback(err,null);
            db.close();
            return;
        }
        db.collection(collectionName).count(json,function(err,count){
            if(err){
                callback(err,null);
                db.close();
                return
            }
            callback(null,count);
            db.close();
        })
    })
}