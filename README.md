# Update Log

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

### v4.0 利用ajax结合前端模板显示留言列表；

* 在页面html内容下面追加前端模板文件，并引入underscore引擎；

```html
    <div class="container">
        <div id="quanbuliuyan">
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

            for (var i=0; i<result.result.length; i++){
                 //将返回的数据，利用underscore插入到模板之中；成为html语句，并将语句追加到页面中；
                var compiled = _.template($("#moban").html());
                var html= compiled({"xingming":result.result[i].xingming,"liuyan":result.result[i].liuyan});
                $("#quanbuliuyan").append($(html));
            }
            
        })
    </script>
```