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

* 在页面html内容下面追加前端模板

```html
   <script type="text/template">
        <div class="list-group">
          <a href="#" class="list-group-item active">
            <h4 class="list-group-item-heading">List group item heading</h4>
            <p class="list-group-item-text">...</p>
          </a>
        </div>
    </script>
    <script src="js/jquery-1.11.3.min.js"></script>
```