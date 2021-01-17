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
                    case 'CLOSETAB':
                        return self._closeTab(this, arg[1]);
                    case 'ADDTAB':
                        return self._addTab(this, arg[1]);
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
        _ini: function ($rootEl, options) {
            var op = $.extend({}, this.defaultOptions, options || {}), that = this;
            $rootEl.on("click", "span.ui-icon-close", function (e) {
                that._closeTab($rootEl, $(this).closest("li").attr("aria-controls").replace('tab_', ''))
            }).on('tabsonclose', function (e, removedTabID) {
                op.onClose(e, removedTabID);
            });
            return $rootEl.tabs(op);
        },
        _closeTab: function ($rootEl, tabId) {
            $('#tab_' + tabId).remove(); // remove panel element
            $('a[href="#tab_' + tabId + '"]').parent().remove(); // remove li element
            $rootEl.tabs("refresh").trigger('tabsonclose', [tabId])
            return this;
        },
        _addTab: function ($rootEl, tabObj) {
            var id = 'tab_' + tabObj.id, rootId = $rootEl.attr('id');
            if (!$('#' + rootId + ' a[href="#' + id + '"]').length) {
                var panelElement = $('<div id="' + id + '">در حال بارگذاری ...</div>');
                var aEl = $('<a href="#' + id + '">' + tabObj.text + '</a>').one('click', function (e) {
                    $$.importModule(tabObj.data.jsModulePath).then(function (result) {
                        panelElement.empty();
                        return result.default({
                            treeNodeObj: tabObj,
                            panelElement: panelElement,
                            containerID: tabObj.id + '_'
                        });
                    });
                }), liEl = $('<li><span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>').append(aEl);
                $('#' + rootId + ' ul:first-child').append(liEl);
                $rootEl.append(panelElement).tabs("refresh");
            }
            return $rootEl;
        },
        _selectTab: function ($rootEl, tabId) {
            tabId = 'tab_' + tabId;
            $('a[href="#' + tabId + '"]').click();
            return $rootEl;
        }
    });
    $._createPlugin('tabAdapter', tabAdapter);
})(jQuery);