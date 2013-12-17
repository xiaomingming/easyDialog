#easyDialog
==========

#一个简单的jquery弹层插件

这是一个基于jquery 1.8.2版本的弹层插件，目前支持的功能包括：

* 非异步的宽高自适应，宽高也可定义
* 自定义浮层位置，默认居中
* 支持异步回调
* 支持浮层信息DOM片段定义
* 遮罩显示/隐藏

##使用文档
***

###html约定

```html:
<div id="easy-dialog" class="easy-dialog"></div>
```
###javascript 调用

请先引入jquery 1.8.2 版本库脚本，然后基本调用如下：

```javascript
$('#easy-dialog').easyDialog({
    cHeight: 80,
    dTitle: '测试标题',
    dContentTmp: '<p>啦啦啦，这是一个浮层测试</p>' , 
    dCloseTxt: 'close',
    OK: function() {
        window.location.href="http://www.baidu.com";
    }
});
```

