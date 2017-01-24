# Update Log

### V1.0 mongodb数据库 DAO层函数的封装
主要涉及三个文件：

* 主入口文件 app.js
* 封装的函数 ./model/db.js
* mongodb 链接配置文件 setting.js

### 留言的静态模板文件——index.ejs

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