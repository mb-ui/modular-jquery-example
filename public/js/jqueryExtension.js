(function ($) {
    $.extend({
        $getResources: function (url) {
            url.constructor === Array || (url = [url]);
            for (var i = 0, l = url.length; i < l; i++) {
                url[i] = $.ajax({
                    url: url[i],
                    type: 'get',
                    dataType: 'html'
                });
            }
            return $.when.apply(undefined, url).then(function () {
                var arr = [];
                if (arguments[0].constructor !== Array)
                    arr.push(arguments[0]);
                else
                    for (var i = 0, arg = arguments, l = arg.length; i < l; i++)
                        arr.push(arg[i][0]);
                return arr;
            }).catch(function (er) { throw new Error(er.message); });
        }
    });
    $.fn.extend({
        $toggleTopSearchPanel: function () {
            if (this.hasClass('ui-icon-circle-triangle-n')) {
                this.addClass('ui-icon-circle-triangle-s').removeClass('ui-icon-circle-triangle-n');
                this.parent().parent().addClass('expand');
            } else {
                this.addClass('ui-icon-circle-triangle-n').removeClass('ui-icon-circle-triangle-s');
                this.parent().parent().removeClass('expand');
            }
            return this;
        },
        findByCode: function (codeName) { return this.find('[code="' + codeName + '"]').first(); },
        sideMenu: (function () {
            var defaultOp = {
                dir: 'ltr', resizable: true, tabListWidth: '40px', panelWidth: 300, defaultOpen: false
            }, temps = {
                tabList: '<div class="sideMenu-tabList ui-widget ui-widget-content">',
                panelList: '<div class="sideMenu-panelList ui-widget ui-widget-content ui-corner-let"></div>',
                resizerContainer: '<div class="sideMenu-resizerContainer"></div>',
                resizer: '<div class="sideMenu-resizer ui-state-default"></div>'
            }, createEls = function (temps) {
                var obj = {};
                $.each(temps, function (key, value) {
                    obj[key] = $(value);
                });
                return obj;
            };
            return function () {
                var arg = arguments, argL = arg.length;
                switch (argL) {
                    case 0:
                        return this.sideMenu({});
                    case 1:
                        if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]') {
                            var that = this, param = $.extend({}, defaultOp, arg[0]), setXPos = param.dir == 'ltr' ? function ($el, value) {
                                return $el.css({ left: value + 'px', right: 'auto' });
                            } : function ($el, value) { return $el.css({ right: value + 'px', left: 'auto' }); };
                            param.tabListWidth = parseFloat(('' + param.tabListWidth).split('px')[0]);
                            param.panelWidth = parseFloat(('' + param.panelWidth).split('px')[0]);
                            this.each(function (index, el) {
                                var els = createEls(temps);
                                el = $(el);
                                el.hide().append(els.panelList.addClass(param.dir)).append(els.tabList.width(param.tabListWidth)
                                    .addClass(param.dir).click(function (e) {
                                        that.hasClass('sideMenu-open') ? that.sideMenu('close') : that.sideMenu('open');
                                    }))
                                    .append(els.resizerContainer.addClass(param.dir)).append(els.resizer);
                                setXPos(els.panelList, param.tabListWidth).width(param.panelWidth);
                                setXPos(els.resizer, param.tabListWidth + param.panelWidth + 2).addClass(param.dir);
                                setXPos(els.resizerContainer, param.tabListWidth);
                                if (param.defaultOpen) {
                                    that.addClass('sideMenu-open');
                                } else { els.resizer.hide(); els.panelList.hide(); }
                                if (param.resizable) {
                                    els.resizer.draggable({
                                        revert: "invalid", // when not dropped, the item will revert back to its initial position
                                        containment: "document",
                                        helper: "clone",
                                        containment: els.resizerContainer[0],
                                        cursor: 'ew-resize',
                                        start: function (event, ui) {
                                        }
                                    });
                                    els.resizerContainer.droppable({
                                        accept: ".sideMenu-resizer",
                                        cursor: 'ew-resize',
                                        classes: { "ui-droppable-active": "loading" },
                                        drop: function (event, ui) {
                                            var _panelWidth, _diff = ui.position.left - els.panelList[0].getBoundingClientRect().left;
                                            _panelWidth = param.dir === 'rtl' ? els.panelList.width() + (-_diff) : _diff;
                                            if (_panelWidth <= 75) { that.sideMenu('close'); return; }
                                            els.panelList.width(_panelWidth);
                                            // horizentalMenuContainer.css({
                                            //     right: _panelWidth + 4 + param.tabListWidth + 'px'
                                            // });
                                            setXPos(els.resizer, param.tabListWidth + _panelWidth + 2);
                                        }
                                    });
                                }
                                el.show();
                            });
                        } else {
                            var param = arg[0];
                            switch (param.toUpperCase()) {
                                case 'CLOSE':
                                    $(this).removeClass('sideMenu-open').children('.sideMenu-panelList,.sideMenu-resizer').hide();
                                    break;
                                case 'OPEN':
                                    $(this).addClass('sideMenu-open').children('.sideMenu-resizer,.sideMenu-panelList').show();
                                    break;
                                default: return this;
                            }
                        }
                    default: return this;
                }
            };
        })()
    });
})(jQuery);
