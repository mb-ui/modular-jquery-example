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
        sideMenu: function () {
            var arg = arguments, argL = arg.length;
            switch (argL) {
                case 0:
                    return this;
                case 1:
                    var param = arg[0], el = $(this), sm = $.fn.sideMenu;
                    if (Object.prototype.toString.call(param).toUpperCase() === '[OBJECT OBJECT]') {
                        var data = sm._createData(el, param), els = data.els;
                        els.tabList.append((function () {
                            var str = '';
                            $.each(param.data, function (i, obj) {
                                str += sm._temps.tab.split('@tabId').join(obj.id).replace('@icon', obj.iconClass).replace('@tooltip', obj.tooltip);
                            });
                            return str;
                        })());
                        el.hide().append(els.panelList.addClass(data.dir).hide().append(els.panel))
                            .append(els.tabList.width(data.tabListWidth).addClass(data.dir).click(data._tabListClkHandler))
                            .append(els.resizerContainer.addClass(data.dir)).append(els.resizer.hide());
                        data.setXPos(els.panelList, data.tabListWidth).width(data.panelWidth);
                        data.setXPos(els.resizer, data.tabListWidth + data.panelWidth + 2).addClass(data.dir);
                        data.setXPos(els.resizerContainer, data.tabListWidth);
                        sm._makeResizable(el, data);
                        return el.show();
                    } else {
                        switch (param.toUpperCase()) {
                            case 'CLOSE':
                                var data = $(this).data(), els = data.els;
                                els.resizer.add(els.panelList).hide();
                                data.onClose({ panelWidth: data.panelWidth, tabListWidth: data.tabListWidth })
                                break;
                            case 'OPEN':
                                var data = $(this).data(), els = data.els;
                                els.resizer.add(els.panelList).show();
                                data.onOpen({ panelWidth: data.panelWidth, tabListWidth: data.tabListWidth })
                                break;
                            case 'DESELECT':
                                $('.sideMenu-tab.ui-state-active', this).removeClass('ui-state-active');
                                this.data().els.panel.empty();
                            default: return this;
                        }
                    }
                case 2:
                    var methodName = arg[0];
                    switch (methodName.toUpperCase()) {
                        case 'SELECT':
                            var id = arg[1];
                            if (typeof id !== 'string')
                                return this;
                            var data = this.data(), selectedTabEl = $('.sideMenu-tab.ui-state-active', this);
                            if (selectedTabEl.length) {
                                selectedTabEl.removeClass('ui-state-active');
                                data.els.panel.empty();
                                if (selectedTabEl.attr('tab-id') === id)
                                    return this.sideMenu('close');
                            }
                            $('[tab-id="' + id + '"].sideMenu-tab').addClass('ui-state-active');
                            data.els.panel.append(data.loadingTemplate);
                            data.getTemplate(data.data[id]).done(function (template) {
                                data.els.panel.empty().append(template);
                                data.onLoadTemplate(data.data[id], data.els.panel);
                            });
                            return this.sideMenu('open');
                        default: return this;
                    }
                default: return this;
            }
        }
    });
    $.extend($.fn.sideMenu, {
        _temps: {
            tabList: '<div class="sideMenu-tabList ui-widget ui-widget-content">',
            panelList: '<div class="sideMenu-panelList ui-widget ui-widget-content ui-corner-let"></div>',
            panel: '<div class="sideMenu-panel"></div>',
            resizerContainer: '<div class="sideMenu-resizerContainer"></div>',
            resizer: '<div class="sideMenu-resizer ui-state-default"></div>',
            tab: '<div tab-id="@tabId" class="sideMenu-tab ui-state-default" title="@tooltip"><span tab-id="@tabId" class="@icon"></span></div>',
        },
        _createEls: function () {
            var obj = {};
            $.each(this._temps, function (key, value) {
                obj[key] = $(value);
            });
            return obj;
        },
        _makeResizable: function ($el, data) {
            var els = data.els;
            if (data.resizable) {
                els.resizer.draggable({
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    containment: els.resizerContainer[0],
                    cursor: 'ew-resize',
                    start: function (event, ui) {
                        els.panelList.addClass('loading');
                        data.beforeResize(event, ui);
                    }
                });
                els.resizerContainer.droppable({
                    accept: ".sideMenu-resizer",
                    cursor: 'ew-resize',
                    classes: { "ui-droppable-active": "loading" },
                    drop: function (event, ui) {
                        var _panelWidth, _diff = ui.position.left - els.panelList[0].getBoundingClientRect().left;
                        _panelWidth = data.dir === 'rtl' ? els.panelList.width() + (-_diff) : _diff;
                        els.panelList.removeClass('loading');
                        if (_panelWidth <= data.panelMinWidth) { $el.sideMenu('deselect').sideMenu('close'); return; }
                        $el.data({ panelWidth: _panelWidth });
                        els.panelList.width(_panelWidth);
                        data.setXPos(els.resizer, data.tabListWidth + _panelWidth + 2);
                        data.onResize(event, ui, { panelWidth: _panelWidth, tabListWidth: data.tabListWidth });
                    }
                });
            }
        },
        defaultOptions: {
            dir: 'ltr',
            resizable: true,
            tabListWidth: '40px',
            panelMinWidth: 150,
            panelWidth: 300,
            loadingTemplate: '<p>loading...</p>',
            onLoadTemplate: function (menuObj, $panelEl) { },
            beforeSelect: function (e, id) { return true },
            beforeResize: function (e, ui) { },
            onResize: function (e, ui, obj) { },
            onOpen: function (obj) { },
            onClose: function (obj) { },
            getTemplate: function (menuObj) {
                return $.ajax({
                    url: menuObj.templateUrl,
                    dataType: 'html',
                    type: 'get'
                });
            }
        },
        _createData: function ($el, params) {
            var _data = params.data, param = $.extend(true, {}, this.defaultOptions, params,
                {
                    data: {},
                    els: this._createEls(),
                    _tabListClkHandler: function (e) {
                        var tabIdAttr = $(e.target).attr('tab-id');
                        (tabIdAttr !== undefined && tabIdAttr !== false) && param._tabClkHandler(e, tabIdAttr);
                    },
                    _tabClkHandler: function (e, id) {
                        param.beforeSelect(e, id) && $el.sideMenu('select', id);
                    }
                });
            param.setXPos = param.dir == 'ltr' ? function ($el, value) {
                return $el.css({ left: value + 'px', right: 'auto' });
            } : function ($el, value) { return $el.css({ right: value + 'px', left: 'auto' }); }
            $.each(_data, function (i, obj) {
                param.data[obj.id] = obj;
            });
            param.tabListWidth = parseFloat(('' + param.tabListWidth).split('px')[0]);
            param.panelWidth = parseFloat(('' + param.panelWidth).split('px')[0]);
            $el.data(param);
            return param;
        }
    });
})(jQuery);
