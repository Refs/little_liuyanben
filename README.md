# Update Log

git版本库在实际学习中的最强应用：每个版本就像游戏中的一个存档点，那一部分内容比较生疏，就直接读档到那个位置，将关卡再过一遍就是了；如**v3.0 处理表单 通过ajax提交的post请求；**这个档位，若自己感觉生疏，完全可以读这个档，**还原当时的作业环境**（省去模拟某个知识点环境的时间与功夫）将自己要走的，重新走一遍；这就等于找到了一个模拟器，让你可以不停的练习哪几招：qaqaqerawa!  下面所写的是每一个关卡的攻略；  学习了git这个应用，自己话那么多时间学习，也值了；这样用起来很舒服；---------此关系重大；

跟着老师做的每一个项目都像是一个游戏，平时自己想玩这个游戏的哪一部分，就去玩这一部分，git可以去读档，readme中有游戏攻略；

### V1.0 mongodb数据库 DAO层函数的封装
主要涉及三个文件：

* 主入口文件 app.js
* 封装的函数 ./model/db.js
* mongodb 链接配置文件 setting.js

向外暴露四个接口：

* 增：`db.insertOne(collectionName,json,callback);`
* 删：`db.deleteMany(collectionName,json,callback);`
* 改：`db.UpdateMany(collectionName,json1,json2,callback)`
* 查：`dn.find(collectionName,json,C,D)`

### v2.0 留言的静态模板文件——index.ejs

> 主要是要使用bootstrap来编写此ejs文件，使用bootsrap时有几处要点需要去注意：
* 首先设置一下express的模板引擎：

```
    app.set("view engine","ejs")
```
* 将bootstrap依赖的 css、fonts、js文件夹放到public文件夹中，并利用express将public文件夹静态出来；

```
    app.use(express.static("./public"))

```

* 新建views文件夹，并在views文件夹中，新建模板文件**index.ejs**

* 将bootstrap的**基本模板**粘贴至**index.ejs**,根据public的静态前缀（可以没有），改正模板中引用静态文件的链接；其中原模板中jquery引用的是外链，需要将jquery下载到本地，并重新连接，利用relative path插件写地址的时候要注意加上后缀，否则会请求不到；

```
    <script src="/js/jquery-3.1.1.js"></script>
```

* **增加bootstrp布局容器**
    - “行（row）”必须包含在 .container （固定宽度）或 .container-fluid （100% 宽度）中，以便为其赋予合适的排列（aligment）和内补（padding）。
    - 通过“行（row）”在水平方向创建一组“列（column）”。
    - 你的内容应当放置于“列（column）”内，并且，只有“列（column）”可以作为行（row）”的直接子元素。
    - 类似 .row 和 .col-xs-4 这种预定义的类，可以用来快速创建栅格布局。Bootstrap 源码中定义的 mixin 也可以用来创建语义化的布局。


```js
    <div class="container">
    //将最外面的布局元素 .container 修改为 .container-fluid，就可以将固定宽度的栅格布局转换为 100% 宽度的布局。
    <div class="row">
        ...
    </div>
    </div>
```

* 查找自己所需的插件，并将其粘贴至容器内部即可；再利用express路由一下，然后利用浏览器请求一下，看模板文件，是否可以正常工作；

```js
    app.get("/",function(req,res){
        res.render("index");
    })
```
* 增加一系列表格组件，表格提交时利用jquery_ajax的post方法来提交，其它就没有什么了；

> 中间有一个注意事项就是，`<!--从bootstrap中直接粘贴过来的一般都为type="submit"的button 发送只能发送get请求；如果想要发送post请求，就要将type改为button--> `

### v3.0 处理表单 通过ajax提交的post请求；

![](http://baihua.xicp.cn/17-1-26/10754556-file_1485391869651_108a7.gif)

* node 在处理一般都是利用formidable 插件来处理 **post** 的请求，首先第一步应安装formidable包；

* 利用formidable 来接收post过来的数据,表单项放在文本域`fields`中,文件项放在文件域 `files`中；

```js
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      
    });
```

* 将接收到的数据，放到数据库itcast的liuyan集合中；做好上述工作后，下一步就是要相应ajax的请求，用res.json()方法相应，使用起来与res.send()没有区别；

```js
    db.insertOne("liuyan",{"xingming":fields.name,"liuyan":files.liuyan},function(err,result){
            if(err){
                res.json({"result":-1});
            }
            res.json({"result":1});
    })
```

* 服务器res.json()相应的对象，会被ajax的post方法的回调函数result参数捕获到；可以根据捕获到的相应做**条件分流**； 

> 在页面中添加两个警告框组件，

```html
        <div class="row" id="success"> 
          <div class="alert alert-success col-md-6" role="alert" >
            <a href="#" class="alert-link">相应成功</a>
          </div>
        </div>
        <div class="row" id="failed">
          <div class="alert alert-danger col-md-6" role="alert">
            <a href="#" class="alert-link">相应错误</a>
          </div>
        </div>
```

```js
//index.ejs中
$("#tijiao").click(function(){
        // 用户再一次点击时，让两个提示框都消失：
          $("#success").hide();
          $("#failed").hide();

        $.post("/tijiao",{"name":$("#xingming").val(),"liuyan":$("#liuyan").val()},function(result){
            //result会捕获服务器响应的对象，
            if(result.result == -1){
                //服务器报错，页面的反应；
                $("#success").fadeIn();
            }else if(result.result == 1){
                //服务器正常相应，页面的反应；
                $("#failed").fadeIn();
            }
        })
})
```

### v4.0 利用ajax结合前端模板在页面初次载入的时候显示留言列表；

![页面加载时利用ajax去get数据](http://baihua.xicp.cn/17-1-26/12727759-file_1485391430734_9ac9.gif)

* 在页面html内容下面追加前端模板文件，并引入underscore引擎；

```html
    填充过的模板，就放在#quanbujiedian中，
    <div class="container">
        <div class="row"> //利用row清除上下浮动；
            <div class="col-md-1"></div> //用一个空盒子，将下面的盒子向右挤一下；
            <div id="quanbuliuyan" class="col-md-5">
        </div>
    </div>
    </div>
   <script type="text/template" id="moban">
        <div class="list-group">
          <a href="#" class="list-group-item active">
            <h4 class="list-group-item-heading"><%=xingming%></h4>
            <p class="list-group-item-text"><%=liuyan%></p>
          </a>
        </div>
    </script>
    <script src="/js/underscore.js"></script>

```
* 在页面载入后，利用ajax发送get请求，将请求返回的数据，利用underscore添加到前端模板文件中；并将加过数据的html语句，利用$()，转化为元素，追加到页面元素中；


```js
    //放在页面尾部，页面加载完毕后，自动执行语句；
    <script type="text/javascript">
        $.get("/du",function(result){
            var json = JSON.parse(result);

            for (var i=0; i<json.result.length; i++){
                 //将返回的数据，利用underscore插入到模板之中；成为html语句，并将语句追加到页面中；
                var compiled = _.template($("#moban").html());
                var html= compiled({"xingming":json.result[i].xingming,"liuyan":json.result[i].liuyan});
                $("#quanbuliuyan").append($(html));
            }
            
        })
    </script>
```

```js
    //服务端接收到，ajax的请求之后
    app.get("/du",function(req,res){
        db.find("liuyan",{},function(err,result){
            if(err){
                res.json(-1);
                return;
            }
            res.json({"result":result});
        })
    })

```

> ajax在请求的时候，后台只需要提供json,而前台将json数据，解析出来就可以了；**前后端的json交互** 

* 处理模板冲突：在ejs页面中，如果我们想使用underscore的模板，就会有模板冲突的问题，因为underscore与ejs一样使用的都是ERB式的分隔符（<% %>）,ejs会认为underscore模板是自己的模板，在渲染的时候就会报错，(不但模板会报错，页面中的任何地方，即使是注释，只要里面有<%%>都会报错)，如下：

```js
    <script type="text/template" id="moban">
        <div class="list-group">
            <a href="#" class="list-group-item active">
                <h4 class="list-group-item-heading"><%= xingming %></h4>
    
                <p class="list-group-item-text"><%= liuyan %></p>
            </a>
        </div>
    </script>
    //ejs以为上面underscore模板是自己的模板。所以报错，提示你没有传入xingming参数。
    /*
    ReferenceError: E:\repository\little_liuyan\views\index.ejs:85
        83|         <div class="list-group"> 
        84|           <a href="#" class="list-group-item active"> 
        >> 85|             <h4 class="list-group-item-heading"><%=xingming%></h4> 
        86|             <p class="list-group-item-text"><%=liuyan%></p> 
        87|           </a> 
        88|         </div> 

        xingming is not defined
    */
```

* 可以通过改变underscore.js的ERB分隔符样式，来解决冲突；

> 引自underscore源码：如果ERB式的分隔符您不喜欢, 您可以改变Underscore的模板设置, 使用别的符号来嵌入代码.定义一个 interpolate 正则表达式来逐字匹配嵌入代码的语句, 如果想插入转义后的HTML代码则需要定义一个 escape 正则表达式来匹配,还有一个 evaluate 正则表达式来匹配您想要直接一次性执行程序而不需要任何返回值的语句.您可以定义或省略这三个的任意一个.

```js
    //源码中：
    _.templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g
    };
```

```js
    //源码中给我的替换示例
    _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g
    };

    var template = _.template("Hello {{ name }}!");
    template({name: "Mustache"});
    => "Hello Mustache!"
```

```js
    //自己改正的最终结果
     _.templateSettings = {
        evaluate    : /\{\{([\s\S]+?)\}\}/g,
        interpolate : /\{\{=([\s\S]+?)\}\}/g,
        escape      : /\{\{-([\s\S]+?)\}\}/g
    };
    //和官方的例子基本上保持一致；
```

* 将underscore模板，用新的分隔符，重新修改一下；

```js
    <script type="text/template" id="moban">
        <div class="list-group">
            <a href="#" class="list-group-item active">
                <h4 class="list-group-item-heading">{{=xingming}}</h4>
    
                <p class="list-group-item-text">{{=liuyan}}</p>
            </a>
        </div>
    </script>
```

* 纠正在使用JSON.parse时的一个错误；

```js
    <script type="text/javascript">
        $.get("/du",function(result){
            //var json = JSON.parse(result);

/**
1.JSON.parse()是用于解析类似'{"name":"xiaoming","age":"12"}'的字符串，而在本式子中，result捕捉到的是服务器返回的json,用JSON.parse()解析一个json格式的数据就会报错；SyntaxError: JSON.parse: unexpected character at line 1 column 2 of the JSON data
2.除不能解析json数据，其对要解析字符串的格式也是有要求的 :
    key值没有被双引号括起来的字符串（普通对象写法）'{name:"xiaoming",age:"12"}' 不能被解析；
    双引号括弧括住单引号key值的字符串也不能被解析 "{'name':'xiaoming','age':'12'}"
3.此处由于result捕捉的本身就是一个json，所以就不用解析了，在服务器返回之前，其已经将数据处理成json了，而ajax所请求的就是一个json; 即将数据解析成json是服务端的事情，不是前台ajax的事情；这一点分工一定要明确；
**/
            //得到模板，能成模板函数，这一步没必要放到，循环语句中；
            var compiled = _.template($("#moban").html());

            for (var i=0; i<result.result.length; i++){
                 //填充模板，数据绑定
                var html= compiled({"xingming":result.result[i].xingming,"liuyan":result.result[i].liuyan});
                //DOM操作，追加子节点；
                $("#quanbuliuyan").append($(html));
            }
            
        })
    </script>
```
### v5.0 改善提交表单时的用户体验；

* 体验改善1---假盒子；将表单数据提交成功后，不能在页面中直接显示提交的数据，而要通过刷新页面（通过$.get("/du",function(result){})），才能将表单数据显示；这样用户体验不好；

```js
 $("#tijiao").click(function(){

    $("#success").hide();
    $("#failed").hide();
    $.post("/tijiao",{"name":$("#xingming").val(),"liuyan":$("#liuyan").val()},function(result){
        
        if(result.result == -1){
            $("failed").fadeIn();
        }else if(result.result == 1 ){
            //当服务器返回“1”时，表单中的数据是真的提交成功了，但是当前页面无法显示，只有通过刷新页面，才能通过ajax从 “/du”页面中得到新的，，所以此处我们先通过，一个假盒子凑出来；
            $("#success").fadeIn();

            var compiled = _.template($("#moban").html());
            var html = compiled({liuyan:$("#liuyan").val(),xingming:$("#xingming").val()})
            //这所以说这个盒子是“假”盒子，原因就在于此处模板中填充的数据，并非是“真”的从数据库中请求到的，而是在用户刚填的表单中读取出来的；
            $(html).insertBefore($("#quanbuliuyan"));
            //将假盒子插到，quanbuliuyanhezi这个整体盒子上面；这样在表单提交，服务器返回1之后，就会将假盒子插入到 quanbuliuyan盒子上面；
        }
    })
 })
```
**学习有时候就是个体力活，有些知识点，并不需要太多脑力，迷迷糊糊的状态下也能将其攻克，所以没有必要等到自己有精神了，脑袋清醒了，再去做某些事情，你去等精神，时间不会去等你**


* 体验改善2，利用假盒子，表单提交后会将假盒子插到全部盒子的上面，但刷新页面之后，假盒子对应的留言，就会跑到最后一个，这是因为我们的数据是倒着排序的，最后一个进入的，最后一个被请求，然后就会最后一个被渲染；

> 解决办法时，每当一个数据存储时，给其加上一个时间fields，记录其被添加到数据库的时间，最后让数据库依据时间进行排序； 

```js 
    //liuyanben.js app.post("tijiao",function(){})中；
 db.insertOne("liuyan",{"xingming":fields.name,"liuyan":fields.liuyan,"shijian":new Date()}
    //数据入库时，加上时间戳
```

> 同时修改前端模板

```js
<script type="text/template" id="moban">
      <div class="liuyankuai">
        <p>【姓名】：{{=xingming}}</p>
        <p>【留言】：{{=liuyan}}</p>
        <p>【时间】：{{=shijian}}</p>
      </div>
</script>
//同时填充实践模板时，要加入时间变量；假盒子中 shijian : new Date();
```

> 重新修改db.js中的查询函数，让其依据shijian,以倒序进行检索；

```js
  var cursor = db.collection(collectionName).find(json).limit(pageamount).skip(skipNumber).sort({"shijian":-1});
  //这样做虽然可以成功，但不符合MVC的规范，因为我们改了DAO层，这个sort与pageamount和skipNumber一样也是一个配置， 可以将sort与pageamount与skip一样，作为接口向外面暴露（暴露到参数中）；正确的修改方式，不是在函数体中，直接加入一个具体的数据，而是将其设为一个变量，作为接口参数，向外暴露；具体的数据有外部调用的函数传入，而自己只负责数据接收（承接）与内部逻辑；暴露的过程可以参照pageamount和skipNumber的暴露过程（V1.0中），下面是暴露的结果：
  ```

```js
//接口C就是一个配置json,配置的接口都放在这个json对象中；
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
        return;
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
//外部函数调用时：参数C中传入配置sort;
// db.find("liuyan",{},{"sort":{"shijian":-1}},function(err,result){});
```
> db.find函数中，配置json的接口暴露，以及函数的重载，是理解函数的关键；这是一个关键点，弄清了，就会距离高手更近一步；

### v6.0 分页

* 将数据库的检索结果进行分页，mongo的DAO层的函数中db.find()函数中有能接收**外部传入分页配置**的接口参数；通过配置，即可以对检索的结果进行分页；

> 我们很难改变数据库内的存放方式，但我们可以通过一些列的配置，可以很容易的改变数据库的检索方式；

```js
//前台的接口是请求 /du?page=0的时候返回前三条数据，/du?page=1的时候向后返回3条数据，前面的接口写好了，后面就是前端配合后端了；
app.get("/du",function(req,res){
    var page = req.query.page;//接收网页查询参数；
    var pageamount = 3;
    db.find("liuyan",{},{"page":page,"pageamount":pageamount",sort":{"shijian":-1}},function(err,result){
        if(err){
            console.log(err);
            res.json(-1);
            return;
        }
        res.json({"result":result});
    })
})
```
* 前台页面中增加bootstrap分页条；
```
<nav>
    <ul class="pagination">
    <li><a href="#">&laquo;</a></li>
    <li><a href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">4</a></li>
    <li><a href="#">5</a></li>
    <li><a href="#">&raquo;</a></li>
    </ul>
</nav>
```
* 利用ajax实现局部刷新：当分页按钮切换时，浏览器的地址栏是不变的，真的造成网页中的某一部分局部刷新，

* 给分页中每一个li都添加监听
    
```js
    //index.ejs
    //1.为需要监听的页码按钮都增加一个类：yemaanniu
    //2.为要监听的每一个li都增加一个属性data-page

   
    <nav>
        <ul class="pagination">
        <li><a href="#">&laquo;</a></li>
        <li data-page="1" class="yemaanniu active"><a href="#">1</a></li>
        <li data-page="2" class="yemaanniu"><a href="#">2</a></li>
        <li data-page="3" class="yemaanniu"><a href="#">3</a></li>
        <li data-page="4" class="yemaanniu"><a href="#">4</a></li>
        <li data-page="5" class="yemaanniu"><a href="#">5</a></li>
        <li><a href="#">&raquo;</a></li>
        </ul>
    </nav>
```

```js
     //2.为所有类名为yemaanniu的按钮增加一个监听:
    $(".yemaanniu").click(function(){
        //3.按钮点击时重新发起请求；即利用ajax重新发送一次get请求，
        var page = parseInt($(this).attr("data-page"))
        getdata(page);
        //5.参数page的设定，在上面的html中为每一个要监听的li都增加一个属性data-page,函数getdata调用时，参数page就为当前事件对象li的内部属性data-page的值，即var page = parseInt($(this).attr("data-page"))
        //此时在页面上点击分页按钮，就可以请求分页对应的数据，underscore渲染之后，层层插入到#quanbuliuyan节点里面；因为点击第二页的时候，第一页的数据还没有被清除；

        //8.控制li上的class="active",基本思路时为当前点击的事件对象添加class="active",同时将自己兄弟节点的class="active"删除；
        $(this).addClass("active").siblines().removeClass("active");
    })

    //4.将页面初载时发送**get请求的ajax函数**封装为 getdata函数，函数向外暴露一个参数，用来接收传入的分页page,内部逻辑时当传入page为1时，就发送"/du?page=1"

    getdata(0); //页面初次载入的时候，请求"/du?page=0"的数据；
    function getdata(page){ 
     //$.get("/du", function(result){-->

     //7.调整前端页码与后端数据库页码之间的对应，前端的page=1实际上请求的是后台page=0的数据；后台真实的page是从0开始算的；
     //$.get("/du?page="+page, function(result){
     $.get("/du?page="+(page-1), function(result){
         //6.清空#quanbuliuyan节点中的子节点
         $("#quanbuliuyan").html("");

          var compiled = _.template($("#moban").html());
          for (var i=0; i < result.result.length;  i++){
                var html = compiled({"xingming":result.result[i].xingming,"liuyan":result.result[i].liuyan,shijian:result.result[i].shijian});
               
                $("#quanbuliuyan").append($(html));
          }
        }); 
    }

      $("#tijiao").click(function(){

          $("#success").hide();
          $("#failed").hide();
        
        $.post("/tijiao",{"name":$("#xingming").val(),"liuyan":$("#liuyan").val()},function(result){
          if(result.result == -1){
              $("failed").fadeIn();
          }else if(result.result == 1 ){
              $("#success").fadeIn();
              var compiled = _.template($("#moban").html());
              var html = compiled({xingming:$("#xingming").val(),liuyan:$("#liuyan").val(),shijian:new Date()});
              $(html).insertBefore($("#quanbuliuyan"));
          }
        })
      })

```

```js
 //8.分页数的确定，实际上是由集合数据的总条数除去每页分的条数，然后向上取整不够一页也算一页（如每页4条数据，最后的2条也占一页 ）；

 //8.1 在db.js中封装查询数据量的函数 exports.count = function(collectionName,json,callback)

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

 //测试ajax是否正常，只要看其能否正常发送请求，就可以了；

 //8.2上层逻辑 liuyanben.js中
 app.get("/count",function(req,res){
    db.count("liuyan",{},function(err,count){//手底下每一个人都有其具体的业务范围，各人有各人的活，安排某人工作之前，必须给谁提供相应的资源，其有这些资源才能干成活，而寻找这些资源不是其的活；如此处安排db.count就得给其提供collectionName json callback参数，没有这些参数他干不成活，而找这些参数，又不是属于其业务范围内的活；
        if(err){
            res.send(err);
            return;
        }
        res.send(count.toString());
    })
})


```

```js
//8.3 修改后台模板，让其根据 count的值 进行分页数的确定，而不是上来就被定死了；

//改动之前
     <nav>
          <ul class="pagination">
            <li><a href="#">&laquo;</a></li>
            <li data-page="1" class="yemaanniu active" ><a href="#">1</a></li>
            <li data-page="2" class="yemaanniu"><a href="#">2</a></li>
            <li data-page="3" class="yemaanniu"><a href="#">3</a></li>
            <li data-page="4" class="yemaanniu"><a href="#">4</a></li>
            <li data-page="5" class="yemaanniu"><a href="#">5</a></li>
            <li><a href="#">&raquo;</a></li>
          </ul>
        </nav>

//改动之后
    <nav>
          <ul class="pagination">
            <li><a href="#">&laquo;</a></li>
            <% for (var i=1; i<pageamount; i++){  %>
            
            <li data-page="<%=i%>" class="yemaanniu active" ><a href="#"><%=i%></a></li>
           
            <% } %>
            <li><a href="#">&raquo;</a></li>
          </ul>
        </nav>

//完整逻辑

    app.get("/",function(req,res){
        db.count("liuyan",{},function(err,count){
            var pageamount =  Math.ceil(count/4);//Math.ceil向上取整；Math.floor()向下取整；
            res.render("index",{"pageamount":pageamount})
        })
        
    })
//8.4 在前台补充补充按钮的active，li是后台ejs渲染出来的，渲染时都没有active; 
<script type="text/template">
    $(".yemaanniu:first").addClass("active") //给第一个类名为yemaanniu的li 加上一个active类；
</script>
```

```js
//9.分页上一页与下一页的逻辑

    $(".yemaanniu:first").addClass("active");

    //9.1.维持一个全局变量nowpage
    var nowpage = 1; //页面初次加载的时候，active 的 page 为 1；

   //3.为上一页下一页按钮增加监听；<li class="next-btn"><a href="#">&raquo;</a></li>
    $(".next-btn").click(function(){
        nowpage++;
        getdate(nowpage);//点击上将nowpage加1，并请求后台数据；
       // $("[data-page=nowpage]").addClass("active").siblines().removeClass("active");不对；
    })
    //此时还有两个业务没有完成：一个是点击下一页时active在按钮间的移动，二是当到达最后一页时，就不让它继续向下请求了；  angular.js关于分页有封装好的插件；

    $(".yemaanniu").click(function(){
      var page = parseInt($(this).attr("data-page"));
      //2.碰到那个页码按钮之后，就让我们的全局变量now等于谁的page；页面初次加载是nowpage为1，见上一步；
      var nowpage = page;

      getdate(page);
      $(this).addClass("active").siblings().removeClass("active");
    })

    getdate(1);

    function getdate(page){
      // ajax请求数据：
        $.get("/du?page="+(page-1), function(result){

          $("#quanbuliuyan").html("");
          var compiled = _.template($("#moban").html());
          for (var i=0; i < result.result.length;  i++){
                var html = compiled({"xingming":result.result[i].xingming,"liuyan":result.result[i].liuyan,shijian:result.result[i].shijian});
          
                $("#quanbuliuyan").append($(html));
          }
        });  
    }
```

### v7.0 实现删除操作

* 前端模板，要有一个接口，可以接受的_id，当模板被渲染时，可以接受数据库中的-id; 数据删除就是根据这个-id来删除的；
 <p><a href="#" data-id="{{=id}}">删除</a></p>

* undescore在渲染模板时，要将document的_id 传递地前端模板引擎，让其工作；

```js
    var html = compiled({id=result.result[i]._id}) //这样当模板中<p>被渲染出来时，a链接中就会包含对应document的-id值，当a被点击时，其就会发送请求 请求的query就有这个-id;
```

* 当用户点击时，前端 通过get的方式发送请求，并将id作为请求参数传递给后台

```js
<p><a href="/shanchu?id={{=id}}">删除</a></p>
```
* 后台要能接受接收，请求中的_id; 

```js
var id = req.query.id
```
* 然后后台调用db.deleteMany,并将id作为过滤条件传入{"_id":id},但这样直接传会造成一个错误；mondodb集合中document的key为-id的value是一个对象 `"_id" : ObjectId("588c1280eca12d1c60e3cd09")`，而此时传入的是一个字符串；刷选不到；需要先将id转化为对象之后再传入；

```js
var ObjectId = require("mongodb").ObjectId;//用来将一个字符串转成一个ObjectId;
app.get("/shanchu",function(req,res){
    var id = req.query.id;
    db.deleteMany("liuyan",{"_id":ObjectId(id)},function(err,result){
        if(err){res.send(err);return}
        res.send("删除成功，请自己返回");
    })
})
```
* 利用 node 重定向，删除之后重定向回来`res.redirect(path)`

```js
db.deleteMany("liuyan",{"_id":ObjectId(id)},function(err,result){
    res.redirect("/");
})
```



> 将前台业务引到一个链接中去，然后后台去迎合这个链接；