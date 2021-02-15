(function ($) {
    $.widget('custom.tabAdapter', $.ui.tabs, {
        options: {},
        getTabIdByElement: function ($tabEl) { return $tabEl.attr("aria-labelledby"); },
        closeTabByID: function (tabID) {
            $('div[aria-labelledby="' + tabID + '"]', this.element).
                add('li[aria-labelledby="' + tabID + '"]', this.element).remove(); // remove li and its panel element
            this.refresh();
            this._trigger('onclose', null, { removedTabID: tabID });
            return this;
        },
        closeTabByElement: function ($tabEl) { return this.closeTabByID(this.getTabIdByElement($tabEl)); },
        selectTabByID: function (tabID) {
            $('a#' + tabID).trigger('click');
            return this;
        },
        selectTabByElement: function ($tabEl) { return this.selectTabByID(this.getTabIdByElement($tabEl)); },
        _create: function () {
            var that = this;
            this._tabIdPrefix = 'tab_';
            this._panelIdPrefix = 'panel_';
            this._hiddenPanelClass = 'tabAdapter-displayNone';
            this._loadedCssClass = 'loaded';
            this._temp = {
                panelTemp: '<div id="@panelID"></div>',
                aTemp: '<a href="@href" id="@aID">@text</a>',
                closeIconTemp: '<span class="ui-icon ui-icon-close" role="presentation"></span>',
                liTemp: '<li aria-labelledby="@ariaLabelledby" aria-controls="@ariaControls" @attr>@closeIconTemp@aTemp</li>'
            };
            this._checkULElement()
                ._on(this.element, {
                    'tabadapteractivate': function (e, ui) {
                        ui.oldPanel && ui.oldPanel.addClass(that._hiddenPanelClass);
                        setTimeout(function () { ui.newPanel.removeClass(that._hiddenPanelClass); }, 10);
                    },
                    'click span.ui-icon-close': function (e) {
                        that.closeTabByElement($(e.currentTarget).closest("li"))
                    },
                    'tabadapterbeforeactivate': function (e, ui) {
                        if (!ui.newPanel.hasClass(that._loadedCssClass)) {
                            that._trigger('beforefirstactivate', e, ui);
                            ui.newPanel.addClass(that._loadedCssClass);
                        }
                    }
                });
            return this._super();
        },
        _checkULElement: function () {
            if (!$('ul:first-child', this.element).length)
                this.element.append('<ul>');
            return this;
        },
        _isOpenTab: function (tabID) {
            if ($('#' + tabID).length)
                return true;
            return false;
        },
        openTabs: function (arrayOfTabObj) {
            if (arrayOfTabObj.constructor !== Array) { arrayOfTabObj = [arrayOfTabObj]; }
            var liElements = '', panelElements = '', temp = this._temp, _liTemp = temp.liTemp, that = this;
            $.each(arrayOfTabObj, function (i, tabObj) {
                if (!that._isOpenTab(tabObj.tabID)) { // if tab is not open.

                    // extend default tab object by params
                    var obj = $.extend({}, that._getDefaultTabObj(), tabObj);

                    // check anchor href
                    if (obj.href === '#') { obj.href += obj.panelID; }

                    // fill close icon template in tab template
                    _liTemp = obj.closable ? _liTemp.replace('@closeIconTemp', temp.closeIconTemp) : _liTemp.replace('@closeIconTemp', '');

                    // insert anchor template and tab text value inside the tab template
                    _liTemp = _liTemp.replace('@aTemp', temp.aTemp).replace('@text', obj.text).replace('@href', obj.href)
                        .replace('@aID', obj.tabID).replace('@ariaLabelledby', obj.tabID).replace('@ariaControls', obj.panelID);

                    // add li element attributes
                    var liAttributes = '';
                    $.each(obj.attr, function (attrName, attrValue) {
                        liAttributes += attrName + '="' + attrValue + '" ';
                    });
                    liAttributes = liAttributes || '';
                    _liTemp = _liTemp.replace('@attr', liAttributes);

                    // concat tab and panel temlates 
                    liElements += _liTemp;
                    panelElements += temp.panelTemp.replace('@panelID', obj.panelID);
                }
            });
            if (liElements && panelElements) {
                // append templates inside the element
                $('ul:first-child', this.element).append(liElements);
                this.element.append(panelElements);
                this.refresh();
            }
            return this;
        },
        _getDefaultTabObj: function () {
            var id = $.now();
            return {
                tabID: this._tabIdPrefix + id,
                panelID: this._panelIdPrefix + id,
                href: '#',
                icon: '',
                iconTootlip: '',
                text: 'unknown',
                closable: true,
                attr: {} // li element attributes 
            };
        },
        destroy: function () {
            this.element.remove();
            return this._super();
        }
    });
})(jQuery);