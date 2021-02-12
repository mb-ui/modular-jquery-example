(function (factory) { factory(window, document, window.jQuery); })(function (w, d, $, undefined) {
    $.widget('custom.jqSideMenu', {
        options: {
            dir: 'ltr',
            resizable: true,
            show: false,
            hide: false,
            tabListWidth: 40,
            panelListMinWidth: 150,
            panelListWidth: 300,
            getTabTemplate: function (tabObj) {
                return '<span tab-id="' + tabObj.tabID + '" class="' + tabObj.icon + '" title="' + tabObj.tootip + '"></span>';
            },
            loadingTemplate: '<p>loading...</p>',
            beforeresize: $.noop,
            beforeresize_async: $.noop,
            onresize: $.noop,
            onopen: $.noop,
            onclose: $.noop,
            clicktab: $.noop,
            selecttab: $.noop,
            deselecttab: $.noop,
            selecttabfirst: $.noop
        },
        _create: function () {
            var that = this, op = this.options, dir = op.dir, $el = this.element,
                setXPos = dir === 'ltr' ? this._setLtrXposition : this._setRtlXposition;
            this._extendContext(op)._hide($el, op.hide);
            this._addClass(null, dir);
            this.element.append(this.panelList.addClass(dir))
                .append(this.tabList.width(this.tabListWidth).addClass(dir))
                .append(this.resizerContainer.addClass(dir))
                .append(this.resizer);
            op.resizable && this._makeResizable();
            setXPos(this.panelList, this.tabListWidth + 2);
            setXPos(this.resizer, this.tabListWidth + this.panelListWidth + 2);
            setXPos(this.resizerContainer, this.tabListWidth);
            this.panelList.width(this.panelListWidth);
            this._on($el, {
                'click li.sideMenu-tab': function (e) {
                    that._trigger('clicktab', e, that._getCreateEventData()) && that._clickTab($(e.currentTarget));
                }
            });
            this._show($el, op.show);
            return this;
        },
        _clickTab: function ($tabEl) {
            if (this.isOpen) { // if sideMenu is open
                if ($tabEl.hasClass(this._temps.selectedTabClassName))
                    this._deselectTab()._close(); // deselect tab and close sidemenu
                else
                    this._deselectTab()._selectTab($tabEl.attr('tab-id')); // select another tab
            } else {
                this._selectTab($tabEl.attr('tab-id'))._open();
            }
        },
        _extendContext: function (options) {
            var tmp = {
                tab: '<li tab-id="@id" class="sideMenu-tab ui-state-default">@innerTab</li>',
                panel: '<div tab-id="@id" class="sideMenu-panel"></div>',
                tabList: '<ul class="sideMenu-tabList ui-widget ui-widget-content">',
                panelList: '<div class="sideMenu-panelList ui-widget ui-widget-content ui-corner-let"></div>',
                resizerContainer: '<div class="sideMenu-resizerContainer"></div>',
                resizer: '<div class="sideMenu-resizer ui-state-default"></div>',
                selectedTabClassName: 'sideMenu-selected ui-state-active',
                selectedPanelClassName: 'sideMenu-selected',
                alreadyLoadedPanelsClassName: 'sideMenu-panel-alreadyLoaded'
            };
            return $.extend(this, {
                _temps: tmp,
                isOpen: true,
                tabListWidth: options.tabListWidth,
                panelListWidth: options.panelListWidth,
                tabList: $(tmp.tabList),
                panelList: $(tmp.panelList),
                resizerContainer: $(tmp.resizerContainer),
                resizer: $(tmp.resizer)
            });
        },
        _getCreateEventData: function () {
            return {
                isOpen: this.isOpen,
                tabListWidth: this.tabListWidth,
                panelListWidth: this.panelListWidth,
                $tabListEl: this.tabList,
                $panelListEl: this.panelList,
                $resizerContainerEl: this.resizerContainer,
                $resizerEl: this.resizer
            };
        },
        selectTab: function (tabID) {
            return this._selectTab(tabID)._open();
        },
        deselectTab: function () { return this._deselectTab()._close(); },
        _close: function () {
            this.resizer.add(this.panelList).hide();
            this.isOpen = false;
            this._removeClass(null, 'sideMenu-open')._trigger('onclose', null, this._getCreateEventData());
            return this;
        },
        _selectTab: function (tabID) {
            var temp = this._temps, $tabEl = $('[tab-id="' + tabID + '"]', this.tabList)
                , $panelEl = $('[tab-id="' + tabID + '"]', this.panelList);
            $tabEl.addClass(temp.selectedTabClassName);
            $panelEl.addClass(temp.selectedPanelClassName);
            var data = $.extend({}, this._getCreateEventData(), { $panelEl: $panelEl, $tabEl: $tabEl });
            if (!$panelEl.hasClass(temp.alreadyLoadedPanelsClassName)) {
                $panelEl.addClass(temp.alreadyLoadedPanelsClassName);
                this._trigger('firstselecttab', null, data);
            }
            this._trigger('selecttab', null, data);
            return this;
        },
        _deselectTab: function () {
            var temp = this._temps,
                selectedTab = $('.' + temp.selectedTabClassName.split(' ').join('.'), this.tabList).first(),
                selectedPanel = $('.' + temp.selectedPanelClassName.split(' ').join('.'), this.panelList).first();
            if (selectedTab.length) {
                selectedTab.removeClass(temp.selectedTabClassName);
                selectedPanel.removeClass(temp.selectedPanelClassName);
                var data = $.extend({}, this._getCreateEventData(), { $panelEl: selectedPanel, $tabEl: selectedTab });
                this._trigger('deselecttab', null, data);
            }
            return this;
        },
        _open: function () {
            this.resizer.add(this.panelList).show();
            this.isOpen = true;
            this._addClass(null, 'sideMenu-open')._trigger('onopen', null, this._getCreateEventData());
            return this;
        },
        getTabObj: function ($tabEl) {
            var tabID = $tabEl.attr('tab-id');
            return this.tabsData[tabID];
        },
        _setTabObj: function (tabObj) {
            this.tabsData = this.tabsData || {};
            this.tabsData[tabObj.id] = tabObj;
            return this;
        },
        openTabs: (function () {
            var _getDefaultTabObj = function () {
                return {
                    id: $.now(),
                    icon: '',
                    tootip: '',
                    text: 'unknown',
                    extarOptions: {}
                };
            };
            return function (tabObjArray) {
                if (tabObjArray.constructor !== Array)
                    tabObjArray = [tabObjArray];
                var liElements = '', panelElements = '', temp = this._temps, that = this;
                $.each(tabObjArray, function (i, tabObj) {
                    var obj = $.extend({}, _getDefaultTabObj(), tabObj);
                    that._setTabObj(obj);
                    liElements += temp.tab.replace('@id', obj.id).replace('@innerTab', that.options.getTabTemplate(obj));
                    panelElements += temp.panel.replace('@id', obj.id);
                });
                if (liElements && panelElements) {
                    this.tabList.append(liElements);
                    this.panelList.append(panelElements);
                }
                return this;
            };
        })(),
        _setLtrXposition: function ($el, value) { $el.css({ left: value + 'px', right: 'auto' }); return this; },
        _setRtlXposition: function ($el, value) { $el.css({ right: value + 'px', left: 'auto' }); return this; },
        _makeResizable: function () {
            var op = this.options, that = this;
            this.resizer.draggable({
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                containment: "document",
                helper: "clone",
                containment: this.resizerContainer[0],
                cursor: 'ew-resize',
                start: function (event, ui) {
                    var data = $.extend({}, ui, that._getCreateEventData());
                    that._trigger('beforeresize', event, data);
                    that.window[0].setTimeout(function () {
                        that._trigger('beforeresize_async', event, data);
                    }, 5);
                }
            });
            this.resizerContainer.droppable({
                accept: ".sideMenu-resizer",
                cursor: 'ew-resize',
                classes: { "ui-droppable-active": "loading" },
                drop: function (event, ui) {
                    var _panelWidth, _diff = ui.position.left - that.panelList[0].getBoundingClientRect().left,
                        setXPos = op.dir === 'ltr' ? that._setLtrXposition : that._setRtlXposition;
                    _panelWidth = op.dir === 'rtl' ? that.panelList.width() + (-_diff) : _diff;
                    if (_panelWidth <= op.panelListMinWidth) {
                        that.deselectTab();
                        return;
                    }
                    that.panelListWidth = _panelWidth;
                    that.panelList.width(_panelWidth);
                    setXPos(that.resizer, that.tabListWidth + _panelWidth + 2);
                    that._trigger('onresize', event, $.extend({}, ui, that._getCreateEventData()));
                }
            });
            return this;
        },
        _destroy: function () {
            this.resizer.add(this.panelList).add(this.tabList).add(this.resizerContainer).remove();
        }
    });
});