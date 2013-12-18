(function(window, $, undefined) {
    var my = {}, constructorFunName = "EDialog", pluginName = "easyDialog";
    my.isYourType = function(obj, type) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
    };
    my.isIE6 = function() {
        return $.browser.msie && $.browser.version === "6.0";
    };
    my.dialogTmp = [ '<div class="easy-dialog-header">', "<h1>弹层名</h1>", '<a href="#" class="easy-dialog-close">关闭</a>', "</div>", '<div class="easy-dialog-content">', '<div class="easy-dialog-content-inner"></div>', "</div>", '<div class="easy-dialog-footer">', "<p>", '<button type="button" class="btn-confirm">确定</button>', "</p>", "</div>" ].join("");
    my.dialogFilterTmp = '<div class="easy-dailog-filter"></div>';
    my.renderTmp = function(wrapper) {
        wrapper.html("").append(my.dialogTmp);
    };
    my[constructorFunName] = function(container, options) {
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        this.container = container;
        my.renderTmp(this.container);
        this.header = container.find(".easy-dialog-header");
        this.cont = container.find(".easy-dialog-content .easy-dialog-content-inner");
        this.footer = container.find(".easy-dialog-footer");
        this.zindex = settings.zindex;
        this.dTitle = settings.dTitle;
        this.dCloseTxt = settings.dCloseTxt;
        this.dContentTmp = settings.dContentTmp;
        this.cWidth = Number(settings.cWidth || 0);
        this.cHeight = Number(settings.cHeight || 0);
        this.pLeft = settings.pLeft;
        this.pTop = settings.pTop;
        this.pRight = settings.pRight;
        this.pBottom = settings.pBottom;
        this.closeBtn = this.header.find(".easy-dialog-close");
        this.confirmBtn = this.footer.find(".btn-confirm");
        this.isShowFilter = settings.isShowFilter;
        this.cancel = settings.cancel;
        this.OK = settings.OK;
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor:my[constructorFunName],
        init:function() {
            this.renderDialogContent().renderDialogTitle().renderDialogModel().eventControl();
            this.isShowFilter && this.renderFilterContent();
        },
        getDialogModelStyle:function() {
            this.cWidth = this.cWidth || this.cont.outerWidth();
            this.cHeight = this.cHeight || this.cont.outerHeight();
            var _this = this, headerHeight = this.header.outerHeight(), footerHeight = this.footer.outerHeight(), containerHeight = this.cHeight + headerHeight + footerHeight;
            return {
                headerHeight:headerHeight,
                footerHeight:footerHeight,
                containerHeight:containerHeight
            };
        },
        setDialogPosition:function() {
            if (this.pLeft === "center") {
                this.pLeft = "50%";
                this.leftCenter = true;
            }
            if (this.pTop === "center") {
                this.pTop = "50%";
                this.topCenter = true;
            }
        },
        renderDialogModel:function() {
            var _this = this, containerHeight = this.getDialogModelStyle().containerHeight, windowScrollTop = $(window).scrollTop(), dialogStyleSettings = {}, pubSettings = {};
            this.setDialogPosition();
            this.cont.parent(".easy-dialog-content").css({
                width:_this.cWidth + "px",
                height:_this.cHeight + "px"
            });
            dialogStyleSettings.left = this.pLeft;
            dialogStyleSettings.right = this.pRight;
            dialogStyleSettings.bottom = this.pBottom;
            dialogStyleSettings.top = this.pTop;
            if (!dialogStyleSettings.left && !dialogStyleSettings.right && !dialogStyleSettings.top && !dialogStyleSettings.bottom) {
                dialogStyleSettings.left = "50%";
                dialogStyleSettings.top = "50%";
                this.topCenter = true;
                this.leftCenter = true;
            }
            pubSettings = {
                position:my.isIE6() ? "absolute" :"fixed",
                width:_this.cWidth + "px",
                height:containerHeight + "px",
                marginTop:_this.topCenter ? -containerHeight / 2 + (my.isIE6() ? windowScrollTop :0) + "px" :"0",
                marginLeft:_this.leftCenter ? -_this.cWidth / 2 + "px" :"0",
                zIndex:_this.zindex
            };
            dialogStyleSettings = $.extend(dialogStyleSettings, pubSettings);
            this.container.css(dialogStyleSettings).show();
            return this;
        },
        setDialogTitle:function() {
            return this.dTitle;
        },
        renderDialogTitle:function() {
            this.header.find("h1").text(this.setDialogTitle());
            this.header.find(".easy-dialog-close").text(this.dCloseTxt);
            return this;
        },
        setDialogContent:function(cont) {
            if (my.isYourType(this.dContentTmp, "function")) {
                return this.dContentTmp(cont);
            } else if (my.isYourType(this.dContentTmp, "string")) {
                return this.dContentTmp;
            }
        },
        renderDialogContent:function() {
            var _this = this;
            if (my.isYourType(this.setDialogContent(), "string")) {
                this.cont.html(this.setDialogContent());
            } else {
                this.setDialogContent(this.cont);
            }
            this.confirmBtn.on("click", $.proxy(_this.confirmEvent, _this));
            return this;
        },
        renderFilterContent:function() {
            !$(".easy-dailog-filter").length && $("body").append(my.dialogFilterTmp);
            var filterHeight = Math.max(this.getDialogModelStyle().containerHeight, $(document).height());
            $(".easy-dailog-filter").css("height", filterHeight + "px").show();
            return this;
        },
        hideDialog:function() {
            this.container.hide();
            return this;
        },
        hideFilter:function() {
            $(".easy-dailog-filter").hide();
            return this;
        },
        eventControl:function() {
            var _this = this;
            this.closeBtn.on("click", $.proxy(_this.closeEvent, _this));
            my.isIE6() && $(window).on("scroll", $.proxy(_this.scrollEvent, _this));
            return this;
        },
        scrollEvent:function() {
            var w = $(window), containerHeight = this.getDialogModelStyle().containerHeight;
            scrollTop = w.scrollTop(), scrollLeft = w.scrollLeft();
            this.container.css({
                marginTop:-containerHeight / 2 + scrollTop + "px",
                marginLeft:-this.cWidth / 2 + scrollLeft + "px"
            });
        },
        closeEvent:function() {
            this.hideDialog();
            this.hideFilter();
        },
        confirmEvent:function() {
            this.closeEvent();
            my.isYourType(this.OK, "function") && this.OK();
        },
        cancelEvent:function() {
            my.isYourType(this.cancel, "function") && this.cancel();
            this.closeEvent();
        }
    };
    $.fn[pluginName] = function(opts) {
        if (typeof opts === "string") {
            if (opts === "api") {
                return $(this).data("plugin-" + pluginName);
            } else {
                throw new Error('error string ,here supports "api" only!');
            }
        }
        return this.each(function() {
            var that = $(this), s1 = new my[constructorFunName](that, opts);
            if (!that.data("plugin-" + pluginName)) {
                return that.data("plugin-" + pluginName, s1);
            }
        });
    };
    $.fn[pluginName].defaults = {
        cWidth:300,
        isShowFilter:true,
        dContentTmp:function() {
            return "";
        },
        zindex:4,
        OK:function() {}
    };
})(window, jQuery);