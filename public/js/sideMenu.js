(function ($) {
    var _sideMenu = function () {
        var arg = arguments, argL = arg.length, $el = $(this), self = _sideMenu;
        switch (argL) {
            case 0:
                return this;
            case 1:
                var param = arg[0];
                if (Object.prototype.toString.call(param).toUpperCase() === '[OBJECT OBJECT]') {
                    var data = self._createData($el, $.extend({}, self.defaultOptions, param))
                        , els = data.els, dir = data.dir, setXPos = self._setXPos[dir];
                    $el.hide()
                        .append(els.panelList.addClass(dir))
                        .append(els.tabList.width(data.tabListWidth).addClass(dir))
                        .append(els.resizerContainer.addClass(dir))
                        .append(els.resizer);
                    setXPos(els.panelList, data.tabListWidth + 2).width(data.panelWidth);
                    setXPos(els.resizer, data.tabListWidth + data.panelWidth + 2).addClass(dir);
                    setXPos(els.resizerContainer, data.tabListWidth);
                    self._makeResizable($el, data);
                    return $el.on('click', 'li.sideMenu-tab', function (e) {
                        var $tabEl = $(this), isOpen = $el.data('isOpen');
                        if (isOpen) { // sideMenu is open
                            if ($tabEl.hasClass(self._temps.selectedTabClassName))
                                self._deselectTab($el)._close($el); // deselect tab and close sidemenu
                            else
                                self._deselectTab($el)._selectTab($el, $tabEl); // select another tab
                        } else {
                            self._selectTab($el, $tabEl)._open($el);
                        }

                    }).show();
                } else {
                    switch (param.toUpperCase()) {
                        case 'DESELECTTAB'://deselectTab
                            self._deselectTab($el)._close($el);
                            return $el;
                        default: return this;
                    }
                }
            case 2:
                switch ((arg[0]).toUpperCase()) {
                    case 'SELECTTAB':
                        self._selectTab($el, arg[1])._open($el);
                        return $el;
                    case 'OPENTABS':
                        self._openTabs($el, arg[1]);
                        return $el;
                    default: return this;
                }
            default: return this;
        }
    };
    $.extend(_sideMenu, {
        _close: function ($el) {
            var data = $el.data(), els = data.els;
            els.resizer.add(els.panelList).hide();
            $el.data('isOpen', false).removeClass('sideMenu-open');
            data.onClose({ panelWidth: data.panelWidth, tabListWidth: data.tabListWidth });
            $el.trigger('onclose.sidemenu', [{ panelWidth: data.panelWidth, tabListWidth: data.tabListWidth }]);
            return this;
        },
        _selectTab: function ($el, tab) {
            var temp = this._temps, obj = this._getElementsByTab($el, tab), tabObj = $el.data(obj.id), selectTab = $el.data('selectTab')
                , firstSelectTab = $el.data('firstSelectTab');
            obj.tab.addClass(temp.selectedTabClassName);
            obj.panel.addClass(temp.selectedPanelClassName);
            if (tabObj.isLoaded) {
                selectTab(event, { tab: obj.tab, panel: obj.panel, tabObj: tabObj });
                $el.trigger('selecttab.sidemenu', [{ tab: obj.tab, panel: obj.panel, tabObj: tabObj }]);
            } else {
                tabObj.isLoaded = true;
                $el.data(obj.id, tabObj);
                firstSelectTab(event, { tab: obj.tab, panel: obj.panel, tabObj: tabObj });
                $el.trigger('firstselecttab.sidemenu', [{ tab: obj.tab, panel: obj.panel, tabObj: tabObj }]);
            }
            return this;
        },
        _getElementsByTab: function ($el, tab) {
            var id, $tabEl, els = $el.data('els');
            if (typeof tab === 'string') {
                id = tab;
                $tabEl = $('.sideMenu-tab[tab-id="' + id + '"]', els.tabList)
            } else {
                $tabEl = tab;
                id = $tabEl.attr('tab-id');
            }
            var $panelEl = $('.sideMenu-panel[tab-id="' + id + '"]', els.panelList);
            return { tab: $tabEl, panel: $panelEl, id: id };
        },
        _deselectTab: function ($el) {
            var temp = this._temps, els = $el.data('els'), deselectTab = $el.data('deselectTab'), tabObj = {},
                selectedTab = $('.' + temp.selectedTabClassName.split(' ').join('.'), els.tabList).first(),
                selectedPanel = $('.' + temp.selectedPanelClassName.split(' ').join('.'), els.panelList).first();
            if (selectedTab.length) {
                selectedTab.removeClass(temp.selectedTabClassName);
                selectedPanel.removeClass(temp.selectedPanelClassName);
                tabObj = $el.data(selectedTab.attr('tab-id'));
                deselectTab(event, { tab: selectedTab, panel: selectedPanel, tabObj: tabObj });
                $el.trigger('deselecttab.sidemenu', [{ tab: selectedTab, panel: selectedPanel, tabObj: tabObj }]);
            }
            return this;
        },
        _open: function ($el) {
            var data = $el.data(), els = data.els;
            els.resizer.add(els.panelList).show();
            $el.data('isOpen', true).addClass('sideMenu-open');
            data.onOpen({ panelWidth: data.panelWidth, tabListWidth: data.tabListWidth });
            $el.trigger('onopen.sidemenu', [{ panelWidth: data.panelWidth, tabListWidth: data.tabListWidth }]);
        },
        _temps: {
            tab: '<li tab-id="@id" class="sideMenu-tab ui-state-default">@innerTab</li>',
            panel: '<div tab-id="@id" class="sideMenu-panel"></div>',
            tabList: '<div class="sideMenu-tabList ui-widget ui-widget-content">',
            panelList: '<div class="sideMenu-panelList ui-widget ui-widget-content ui-corner-let"></div>',
            resizerContainer: '<div class="sideMenu-resizerContainer"></div>',
            resizer: '<div class="sideMenu-resizer ui-state-default"></div>',
            selectedTabClassName: 'sideMenu-selected ui-state-active',
            selectedPanelClassName: 'sideMenu-selected'
        },
        _createEls: function () {
            var obj = {};
            $.each(this._temps, function (key, value) {
                obj[key] = $(value);
            });
            return obj;
        },
        _makeResizable: function ($el, data) {
            var els = data.els, that = this;
            if (data.resizable) {
                els.resizer.draggable({
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    containment: els.resizerContainer[0],
                    cursor: 'ew-resize',
                    start: function (event, ui) {
                        data.beforeResize(event, ui);
                        $el.trigger('beforeresize.sidemenu', [ui]);
                        setTimeout(function () {
                            data.beforeResizeAsync(event, ui);
                            $el.trigger('beforeresize-async.sidemenu', [ui]);
                        }, 5);
                    }
                });
                els.resizerContainer.droppable({
                    accept: ".sideMenu-resizer",
                    cursor: 'ew-resize',
                    classes: { "ui-droppable-active": "loading" },
                    drop: function (event, ui) {
                        var _panelWidth, _diff = ui.position.left - els.panelList[0].getBoundingClientRect().left;
                        _panelWidth = data.dir === 'rtl' ? els.panelList.width() + (-_diff) : _diff;
                        if (_panelWidth <= data.panelMinWidth) {
                            $el.sideMenu('deselectTab');
                            return;
                        }
                        $el.data({ panelWidth: _panelWidth });
                        els.panelList.width(_panelWidth);
                        that._setXPos[data.dir](els.resizer, data.tabListWidth + _panelWidth + 2);
                        data.onResize(event, ui, { panelWidth: _panelWidth, tabListWidth: data.tabListWidth });
                        $el.trigger('onresize.sidemenu', [ui, { panelWidth: _panelWidth, tabListWidth: data.tabListWidth }]);
                    }
                });
            }
        },
        _openTabs: (function () {
            var counter = 0, getDefaultTabObj = function () {
                counter++;
                return {
                    id: counter,
                    icon: '',
                    tootip: '',
                    text: 'unknown',
                    extarOptions: {}
                };
            };
            return function ($el, tabObjArray) {
                if (tabObjArray.constructor !== Array)
                    tabObjArray = [tabObjArray];
                var liElements = '', panelElements = ''; defaultOp = this.defaultOptions, temp = this._temps, data = $el.data();
                $.each(tabObjArray, function (i, tabObj) {
                    var obj = $.extend({}, getDefaultTabObj(), tabObj);
                    obj.isLoaded = false;
                    liElements += temp.tab.replace('@id', obj.id).replace('@innerTab', defaultOp.getTabTemplate(obj));
                    panelElements += temp.panel.replace('@id', obj.id);
                    $el.data(obj.id, obj);
                });
                if (liElements && panelElements) {
                    data.els.tabList.append(liElements);
                    data.els.panelList.append(panelElements);
                }
                return $el;
            };
        })(),
        defaultOptions: {
            dir: 'ltr',
            resizable: true,
            tabListWidth: '40px',
            panelMinWidth: 150,
            getTabTemplate: function (tabObj) {
                return '<span tab-id="' + tabObj.tabID + '" class="' + tabObj.icon + '" title="' + tabObj.tootip + '"></span>';
            },
            panelWidth: 300,
            loadingTemplate: '<p>loading...</p>',
            beforeResize: function (e, ui) { },
            beforeResizeAsync: function (e, ui) { },
            onResize: function (e, ui, obj) { },
            onOpen: function (obj) { },
            onClose: function (obj) { },
            selectTab: function (e, ui) { },
            deselectTab: function (e, ui) { },
            firstSelectTab: function (e, ui) { }
        },
        _setXPos: {
            ltr: function ($el, value) {
                return $el.css({ left: value + 'px', right: 'auto' });
            },
            rtl: function ($el, value) {
                return $el.css({ right: value + 'px', left: 'auto' });
            }
        },
        _createData: function ($el, param) {
            param.els = this._createEls();
            param.tabListWidth = parseFloat(('' + param.tabListWidth).split('px')[0]);
            param.panelWidth = parseFloat(('' + param.panelWidth).split('px')[0]);
            param.isOpen = true;
            $el.data(param);
            return param;
        }
    });
    $._createPlugin('sideMenu', _sideMenu);
})(jQuery);
