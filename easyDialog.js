/*
 * author:leweiming
 * gmail:xmlovecss # gmail dot com
 */
(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'EDialog',
        pluginName = 'easyDialog';
    /*
     * 判断数据类型是否为你预想的数据类型
     */
    my.isYourType = function(obj, type) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
    };
    // 判断浏览器为IE6
    my.isIE6 = function() {
        return $.browser.msie && ($.browser.version === '6.0');
    };
    // 启动渲染模板
    my.renderTmp = function(wrapper, cont) {
        // 先清空，再填充，避免产生重复填充的问题
        wrapper.html('').append(cont);
    };

    // 构造函数开始
    my[constructorFunName] = function(container, options) {
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        // 初始化
        this.container = container;
        // 是否展示图片
        this.isShowImage = settings.isShowImage;
        // 弹层确认内容
        this.OKVal = settings.OKVal;
        // 确定按钮类型设置
        this.OKType = settings.OKType;
        // 弹层标题
        this.tit = settings.tit;
        // 弹层关闭内容
        this.closeTxt = settings.closeTxt;
        // 是否关闭弹层后，销毁弹层
        this.isDestroy = settings.isDestroy;
        this.dialogFilterTmp = '<div class="easy-dailog-filter"></div>';
        // 是否显示页脚
        this.isShowFooter = settings.isShowFooter;
        this.dialogTmp = [
            '<div class="easy-dialog-header">',
            '<h1>' + this.tit + '</h1>',
            '<a href="javascript:void(0)" class="easy-dialog-close">' + this.closeTxt + '</a>',
            '</div>',
            '<div class="easy-dialog-content">',
            '<div class="easy-dialog-content-inner"></div>',
            '</div>',
            '<div class="easy-dialog-footer">',
            '<p>',
            '<button type="' + this.OKType + '" class="btn-confirm">' + this.OKVal + '</button>',
            '</p>',
            '</div>'
        ].join('');
        // 模板渲染
        container.html('').append(this.dialogTmp);
        // my.renderTmp(this.container);
        // 头部
        this.header = container.find('.easy-dialog-header');
        // 内容区域
        this.cont = container.find('.easy-dialog-content .easy-dialog-content-inner');
        // 底部
        this.footer = container.find('.easy-dialog-footer');
        // 是否移除页脚
        if (!this.isShowFooter) {
            /*修复jquery 在firefox下的 dom remove 方法bug，移除后的dom css定义高度仍然会被计算*/
            this.footer.remove().css('height', '0');
        }

        // 弹层层叠值
        this.zIndex = settings.zIndex;

        // 弹层填充内容
        // 目前仅仅支持html片段
        this.tmp = settings.tmp;

        // 弹层内容宽度设置
        // 此时还不是精确宽高
        // 需要等到内容填充完成后获取
        this.width = Number(settings.width || 0);
        // 弹层内容高度
        this.height = Number(settings.height || 0);
        // 获取位置设置
        this.pLeft = settings.pLeft;
        this.pTop = settings.pTop;
        this.pRight = settings.pRight;
        this.pBottom = settings.pBottom;
        // 关闭
        this.closeBtn = this.header.find('.easy-dialog-close');

        // 确定，取消按钮
        this.confirmBtn = this.footer.find('.btn-confirm');
        // 是否显示遮罩层
        this.isShowFilter = settings.isShowFilter;
        // 获取回调
        this.cancel = settings.cancel;
        this.OK = settings.OK;

        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        init: function() {
            var _this = this;
            _this.renderDialogContent();

            var initilize = function() {
                _this
                    .renderDialogTitle()
                    .renderDialogFooter()
                    .renderDialogModel()
                    .eventControl()
                    .fixHeight();
                _this.isShowFilter && _this.renderFilterContent();
            };
            // initilize();
            this.isShowImage ? $.when(this.imgReady()).then(initilize(), function() {
                _this.cont.find('img').remove();
            }) : initilize();
        },
        updateHeight: function() {
            this.isUpdate = true;
            this.fixHeight();
            return this;
        },
        // 浮层内容渲染好后，再计算高度并更改
        fixHeight: function(isUpdate) {
            var _this = this,
                h = this.getDialogModelStyle().containerHeight;
            this.container.css({
                'height': h + 'px',
                'marginTop': _this.topCenter ? ((-h / 2) + (my.isIE6() ? $(window).scrollTop() : 0) + 'px') : '0'
            });
            this.cont.parent('.easy-dialog-content').css({
                'height': _this.cont.outerHeight() + 'px'
            });
            return this;
        },
        // 判断图片是否载入完毕
        isImgLoaded: function() {
            var imgArr = this.cont.find('img'),
                i = 0,
                j = imgArr.length,
                isReady = j ? true : false;
            for (; i < j; i += 1) {
                if (!imgArr[i].complete) {
                    isReady = false;
                    break;
                }
            }
            return isReady;
        },
        imgReady: function() {
            var def = $.Deferred(),
                _this = this,
                readyCallback,
                timer,
                startTime = new Date(),
                endTime,
                limitTime; //统计调用时间
            readyCallback = function() {
                limitTime = new Date() - startTime;
                if (limitTime > 300) {
                    def.reject();
                    return def;
                }
                timer = setTimeout(function() {
                    if (_this.isImgLoaded()) {
                        def.resolve();
                        clearTimeout(timer);
                    } else {
                        readyCallback();
                    }
                }, 50);
            };
            readyCallback();
            return def;
        },
        // 计算弹层总体高度
        // 应当在内容填充成功以后作为回调
        // 配置的内容宽度，高度，加上弹层本身的头部和底部高度
        getDialogModelStyle: function() {
            // 精确获取内容实际宽高
            // 弹层内容宽度
            this.width = this.isUpdate ? this.cont.outerWidth() : this.width || this.cont.outerWidth();
            // 弹层内容高度
            this.height = this.isUpdate ? this.cont.outerHeight() : this.height || this.cont.outerHeight();
            
            var headerHeight = this.header.outerHeight(),
                footerHeight = this.footer.outerHeight(),
                containerHeight = this.height + headerHeight + footerHeight;

            return {
                headerHeight: headerHeight,
                footerHeight: footerHeight,
                containerHeight: containerHeight
            };

        },
        // 设置浮层的位置
        // 这样配置灵活
        setDialogPosition: function() {
            if (this.pLeft === 'center') {
                this.pLeft = '50%';
                this.leftCenter = true;
            }
            if (this.pTop === 'center') {
                this.pTop = '50%';
                this.topCenter = true;
            }
        },
        // 渲染弹层相关盒子样式
        renderDialogModel: function() {
            var _this = this,
                containerHeight = this.getDialogModelStyle().containerHeight,
                windowScrollTop = $(window).scrollTop(),
                dialogStyleSettings = {}, pubSettings = {};

            // 初始化浮层位置
            this.setDialogPosition();
            /*
             * 内容区填充
             */
            this.cont.parent('.easy-dialog-content').css({
                'width': _this.width + 'px'
            });
            // 自定义位置配置
            dialogStyleSettings.left = this.pLeft;
            dialogStyleSettings.right = this.pRight;
            dialogStyleSettings.bottom = this.pBottom;
            dialogStyleSettings.top = this.pTop;

            // 若位置设置都不存在
            // 则使用居中
            if (!dialogStyleSettings.left && !dialogStyleSettings.right && !dialogStyleSettings.top && !dialogStyleSettings.bottom) {
                dialogStyleSettings.left = '50%';
                dialogStyleSettings.top = '50%';
                this.topCenter = true;
                this.leftCenter = true;
            }
            // 公共样式配置
            pubSettings = {
                'position': my.isIE6() ? 'absolute' : 'fixed',
                'width': _this.width + 'px',
                'marginLeft': _this.leftCenter ? ((-_this.width / 2) + 'px') : '0',
                'zIndex': _this.zIndex
            };
            dialogStyleSettings = $.extend(dialogStyleSettings, pubSettings);
            // 
            this.container.css(dialogStyleSettings).show();
            return this;
        },
        // 盒模型确定好后，
        // 开始进行内容渲染
        // 渲染头，内容，底部
        setDialogTitle: function() {
            return this.tit;
        },
        renderDialogTitle: function() {
            this.header.find('h1').text(this.setDialogTitle());
            this.header.find('.easy-dialog-close').text(this.closeTxt);
            return this;
        },
        renderDialogFooter: function() {
            this.confirmBtn.text(this.OKVal);
            return this;
        },
        setDialogContent: function(cont) {
            if (my.isYourType(this.tmp, 'function')) {
                return this.tmp(cont);
            } else if (my.isYourType(this.tmp, 'string')) {
                return this.tmp;
            }

        },
        // 渲染弹层内容
        // 确定和取消的回调函数应当在此处执行
        // 关闭不受此影响
        renderDialogContent: function() {
            var _this = this;
            // 判断设置内容回调
            // 若是返回串，则插入到this.cont
            // 否则传入this.cont，进行回调
            if (my.isYourType(this.setDialogContent(), 'string')) {
                this.cont.html(this.setDialogContent());
            } else {
                // 异步处理，返回this.cont接口，以供回调
                this.setDialogContent(this.cont);
            }

            // 确定，取消
            this.confirmBtn.on('click', $.proxy(_this.confirmEvent, _this));
            return this;
        },
        // 渲染遮罩层
        renderFilterContent: function() {
            var _this = this;
            // 若遮罩层存在，则不进行重复插入
            !($('.easy-dailog-filter').length) && $('body').append(this.dialogFilterTmp);
            // 为了兼容IE6，设置遮罩层高度
            // 高度为浮层高度和document高度中最大的
            var filterHeight = Math.max(this.getDialogModelStyle().containerHeight, $(document).height());
            $('.easy-dailog-filter').css({
                'height': filterHeight + 'px',
                'z-index': _this.zIndex - 1
            }).show();
            return this;
        },
        // 隐藏弹层
        hideDialog: function() {
            this.container.hide();
            return this;
        },
        // 隐藏遮罩层
        hideFilter: function() {
            $('.easy-dailog-filter').hide();
            return this;
        },
        // 事件控制
        eventControl: function() {
            var _this = this;
            // 关闭事件
            // 使用代理，事件回调中的this已经变成了当前的事件DOM对象
            this.closeBtn.on('click', $.proxy(_this.closeEvent, _this));

            // 滚动滚动条时，调整弹层位置
            // 只针对IE6
            my.isIE6() && $(window).on('scroll', $.proxy(_this.scrollEvent, _this));

            $(document).on('click', function(e) {
                var t = $(e.target);
                if (t.attr('class') === 'easy-dailog-filter') {
                    _this.closeEvent();
                }
            });
            return this;
        },
        // 浏览器滚动条滚动事件
        // 滚动时，是否要更改弹层的位置
        scrollEvent: function() {
            var w = $(window),
                containerHeight = this.getDialogModelStyle().containerHeight,
                scrollTop = w.scrollTop(),
                scrollLeft = w.scrollLeft();

            this.container.css({
                'marginTop': (-containerHeight / 2) + scrollTop + 'px',
                'marginLeft': (-this.width / 2) + scrollLeft + 'px'
            });
        },
        // 销毁浮层内容区
        destory: function() {
            this.container.html('').attr('style', '').removeData('plugin-' + pluginName);
            return this;
        },
        // 按钮关闭
        // 这里要考虑，关闭按钮后，是否清空内容区，还是仅仅隐藏
        closeEvent: function() {
            this.isDestroy ? this.destory() : this.hideDialog();
            // 遮罩层考虑不进行清空
            this.hideFilter();
        },
        // 确定事件
        // 只有回调函数返回true，才执行关闭
        confirmEvent: function() {
            // 此处对于是否存在回调，要做进一步的判断
            my.isYourType(this.OK, 'function') && this.OK() && this.closeEvent();
        },
        // 取消事件
        cancelEvent: function() {
            my.isYourType(this.cancel, 'function') && this.cancel();
            // 取消是否绑定默认关闭呢。。。
            this.closeEvent();
        }
    };
    $.fn[pluginName] = function(opts) {
        // 可初始化并自定义属性及函数
        if (typeof opts === 'string') {
            if (opts === 'api') {
                return $(this).data('plugin-' + pluginName);
            } else {
                throw new Error('error string ,here supports "api" only!');
            }
        }
        return this.each(function() {
            var that = $(this),
                s1 = new my[constructorFunName](that, opts);

            // 若存在该实例，则不需要进行new
            if (!that.data('plugin-' + pluginName)) {
                return that.data('plugin-' + pluginName, s1);
            }

        });
    };
    /*
     * 默认配置
     */
    $.fn[pluginName].defaults = {
        width: 300,
        OKType: 'button',
        OKVal: '确定',
        tit: '',
        closeTxt: '关闭',
        isShowImage: false,
        isDestroy: false,
        isShowFooter: true,
        isShowFilter: true,
        tmp: function() {
            return '';
        },
        zIndex: 11,
        OK: function() {
            return false; //需要自动关闭，返回true即可
        }
    };
})(window, jQuery);