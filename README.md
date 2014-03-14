#easyDialog

##一个简单的jquery弹层插件

这是一个基于`jquery 1.8.2`版本的弹层插件，目前支持的功能包括：

* 非异步的宽高自适应，宽高也可定义
* 自定义浮层位置，默认居中
* 支持异步回调
* 支持浮层信息DOM片段定义
* 遮罩显示/隐藏
* 浮层底部显示/隐藏
* 浮层层叠值设置

暂时不支持对嵌入图片的高度自适应，正在完善中，欢迎使用并反馈。

##兼容性

IE6+，其它高级浏览器。

##使用文档
###html

```html:
<div id="easy-dialog" class="easy-dialog"></div>
```
###javascript 调用

请先引入`jquery 1.8.2`版本库脚本，然后基本调用如下：

```javascript
$('#easy-dialog').easyDialog({
    cHeight: 80,
    dTitle: '测试标题',
    dContentTmp: '<p>啦啦啦，这是一个浮层测试</p>' , 
    dCloseTxt: 'close',
    OK: function() {
        return true;
    }
});
```
###参数说明
1.设置浮层内容区域宽度，高度，不包括浮层头部和底部操作区域。

```javascript
$('#easy-dialog').easyDialog({
    cHeight: 80,//高度
    cWidth: 200//宽度
});
```
2.设置关闭文本内容

```javascript
$('#easy-dialog').easyDialog({
    dCloseTxt: 'close'//设置为'close'
});
```
3.设置浮层信息DOM结构

字符串格式定义：

```javascript
$('#easy-dialog').easyDialog({
    dContentTmp: '<p>啦啦啦，这是一个浮层测试</p>' 
});
```
函数方式定义：

```javascript
$('#easy-dialog').easyDialog({
    dContentTmp: function(){
        return '<p>啦啦啦，这是一个浮层测试</p>' 
    }
});
```
4.设置浮层位置（插件实现：*IE6为position:absolute的居中效果,其它支持fixed属性的浏览器使用position:fixed*）

在不设置的情况下，默认在页面中心位置。但如果设置的话，依据css定位，只允许如下几种设置：

* left,top
* left,bottom
* right,top
* right,bottom
* 水平或者垂直方向的居中，请使用`'center'`

```javascript
$('#easy-dialog').easyDialog({
    pLeft:'center',//水平x轴居中
    pTop:'center'//竖直Y轴居中
});
```
```javascript
$('#easy-dialog').easyDialog({
    pLeft:'100px',//left:100px
    pTop:'50px'//top:50px
});
```
```javascript
$('#easy-dialog').easyDialog({
    pRight:'0',//right:0
    pBottom:'0'//bottom:0
});
```
```javascript
$('#easy-dialog').easyDialog({
    pLeft:'center',//left:50%;
    pBottom:'0'//bottom:0
});
```
5.确定按钮事件

默认点击确定，不关闭浮层。需要手动设置。
```javascript
$('#easy-dialog').easyDialog({
    OK:function(){
        return true;//默认设置为“return false”
    }
});
```
弹层关闭后执行回调

```javascript
$('#easy-dialog').easyDialog({
    OK:function(){
        //callback is here;
        return true;
    }
});
```
6.是否生成遮罩层

```javascript
$('#easy-dialog').easyDialog({
    isShowFilter:false //不生成遮罩层
});
```
7.是否显示浮层底部

```javascript
$('#easy-dialog').easyDialog({
    isShowFooter:false //不显示
});
```
8.浮层层叠值设置

本来这种事情可以在css中去做，目前先提供这样的接口。

赞成使用很小的层叠值(不超过12)，正常页面的层叠值不会有多高，而不是`9999`这样的脑残设置。

```javascript
$('#easy-dialog').easyDialog({
    zindex:11 //默认值为11
});
```
9.内容模板操作

常见的需求是，设置了浮层的内容，然后还要对内容区进行各种操作。目前这里提供了针对内容区的DOM接口以供操作。

```javascript
$('#easy-dialog').easyDialog({
    dContentTmp: function(cont){
        var tpl=['<div class="test">test</div>'].join('');
        $(cont).html(tpl);
        $(cont).find('.test').fadeIn();
        return cont;
    }
});
```
10.异步回调支持

异步回调包括 定时器，ajax操作。支持在内容层的异步操作。提供参数为内容层的jquery DOM 对象。

```javascript
$('#easy-dialog').easyDialog({
    dContentTmp: function(cont){
        return $.get('/').done(function(res){
            $(cont).html('<p>异步回调哦</p>');
        }).fail(function(res){
            $(cont).html('<p>异步回调失败咯</p>');
        });
    }
});
```






