(function ($) {
    var tabAdapter = function () {
        var arg = arguments, argL = arg.length, self = tabAdapter;
        switch (argL) {
            case 0:
                return this;
            case 1:
                if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]')
                    return self._ini(this, arg[0]);
                return this.tabs(arg[0]);
            case 2:
                switch (arg[0].toUpperCase()) {
                    case 'GETTABID':
                        return self._getTabID(this, arg[1]);
                    case 'GETTABOBJ':
                        return self._getTabObj(this, arg[1]);
                    case 'CLOSETAB':
                        return self._closeTab(this, arg[1]);
                    case 'OPENTAB':
                        return self._openTab(this, arg[1]);
                    case 'SELECTTAB':
                        return self._selectTab(this, arg[1]);
                    default:
                        return this.tabs(arg[0], arg[1]);
                }
            default:
                return this.tabs.apply(this, arg);
        }
    };
    $.extend(tabAdapter, {
        defaultOptions: {
            onclose: function () { }
        },
        _temp: {
            panelTemp: '<div id="@panelID"></div>',
            aTemp: '<a href="@href" id="@aID">@text</a>',
            closeIconTemp: '<span class="ui-icon ui-icon-close" role="presentation"></span>',
            liTemp: '<li aria-labelledby="@ariaLabelledby" aria-controls="@ariaControls">@closeIconTemp@aTemp</li>',
            loadedCssClass: 'loaded',
        },
        loadingTemp: '<p class="tabAdapter-loading">laoding...<p>',
        _checkUl: function ($rootEl) {
            if (!$('ul:first-child', $rootEl).length)
                $rootEl.append('<ul>');
            return this;
        },
        _ini: function ($rootEl, options) {
            var that = this;
            options = $.extend({}, this.defaultOptions, options || {});
            this._checkUl($rootEl);
            return $rootEl.tabs(options)
                .on("click", "span.ui-icon-close", function (e) {
                    that._closeTab($rootEl, $(this).closest("li").attr("aria-labelledby"))
                })
                .on('tabsactivate', function (e, ui) {
                    ui.oldPanel && ui.oldPanel.addClass('tabAdapter-displayNone');
                    setTimeout(function () { ui.newPanel.removeClass('tabAdapter-displayNone'); }, 10);
                })
                .on('tabsbeforeactivate', function (e, ui) {
                    if (!ui.newPanel.hasClass(that._temp.loadedCssClass)) {
                        $rootEl.trigger('beforefirstactivate.tabAdapter', [ui]);
                        ui.newPanel.addClass(that._temp.loadedCssClass);
                    }
                })
                .on('onclose.tabAdapter', function (e, tabID) {
                    $rootEl.removeData(tabID);
                });
        },
        _getTabID: function ($rootEl, $liEl) {
            return $liEl.attr('aria-labelledby');
        },
        _closeTab: function ($rootEl, tabId) {
            $('div[aria-labelledby="' + tabId + '"]', $rootEl).remove(); // remove panel element
            $('li[aria-labelledby="' + tabId + '"]').remove(); // remove li element
            $rootEl.tabs("refresh").trigger('onclose.tabAdapter', [tabId]);
            return this;
        },
        _getTabObj: function ($rootEl, tab) { // tab parameter can be eather of tabID or li element
            if (typeof tab !== 'string')
                tab = this._getTabID($rootEl, tab);
            return $rootEl.data()[tab];
        },
        _openTab: (function () {
            var counter = 0, getDefaultTabObj = function () {
                counter++;
                return {
                    tabID: 'tab_' + counter,
                    panelID: 'panel_' + counter,
                    href: '#',
                    icon: '',
                    iconTootlip: '',
                    text: 'unknown',
                    closable: true,
                    extarOptions: {}
                };
            };
            return function ($rootEl, tabObjArray) {
                if (tabObjArray.constructor !== Array)
                    tabObjArray = [tabObjArray];
                var liElements = '', panelElements = '', temp = this._temp, that = this, data = $rootEl.data();
                $.each(tabObjArray, function (i, tabObj) {
                    if (!data.hasOwnProperty(tabObj.tabID)) {
                        var obj = $.extend({}, getDefaultTabObj(), tabObj), _liTemp = temp.liTemp;
                        if (obj.href === '#')
                            obj.href += obj.panelID;
                        _liTemp = obj.closable ? _liTemp.replace('@closeIconTemp', temp.closeIconTemp) : _liTemp.replace('@closeIconTemp', '');
                        _liTemp = _liTemp.replace('@aTemp', temp.aTemp).replace('@text', obj.text).replace('@href', obj.href)
                            .replace('@aID', obj.tabID).replace('@ariaLabelledby', obj.tabID).replace('@ariaControls', obj.panelID);
                        liElements += _liTemp;
                        panelElements += temp.panelTemp.replace('@panelID', obj.panelID);
                        $rootEl.data(obj.tabID, obj);
                    }
                });
                if (liElements && panelElements) {
                    $('ul:first-child', $rootEl).append(liElements);
                    $rootEl.append(panelElements).tabs("refresh");
                }
                return $rootEl;
            };
        })(),
        _selectTab: function ($rootEl, tabId) {
            $('a#' + tabId).click();
            return $rootEl;
        }
    });
    $._createPlugin('tabAdapter', tabAdapter);
})(jQuery);