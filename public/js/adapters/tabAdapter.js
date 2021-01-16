(function ($) {
    var _ini = function (rootEl, options) {
        options = options || {};
        var op = $.extend({}, $.fn.tabAdapter, options);
        rootEl.on("click", "span.ui-icon-close", function (e) {
            var panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
            rootEl.tabs("refresh");
            (op.onClose && (typeof op.onClose === 'function')) && op.onClose(e, panelId.replace('tab_', ''));
        });
        return rootEl.tabs(options);
    }, _closeTab = function (rootEl, tabId) {
        var originalID = tabId;
        tabId = 'tab_' + tabId;
        var panelEl = $('#' + tabId);
        $('a[href="#' + tabId + '"]').parent().remove();
        panelEl.remove();
        var _openDialogIDs = (localStorage.getItem("openTabIDs") || '').split(','), delIndex = _openDialogIDs.indexOf(originalID);
        if (delIndex > 0) {
            _openDialogIDs.splice(delIndex, 1);
            localStorage.setItem("openTabIDs", _openDialogIDs.join());
        }
        return rootEl.tabs("refresh");
    }, _addTab = function (rootEl, tabObj) {
        var id = 'tab_' + tabObj.id, rootId = rootEl.attr('id');
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
            rootEl.append(panelElement).tabs("refresh");
            var _openDialogIDs = (localStorage.getItem("openTabIDs") || '').split(',');
            if ((_openDialogIDs.indexOf(tabObj.id) === -1) && tabObj.id) {
                _openDialogIDs.push(tabObj.id);
                localStorage.setItem("openTabIDs", _openDialogIDs.join());
            }
        }
        return rootEl;
    }, _activeTab = function (rootEl, tabId) {
        tabId = 'tab_' + tabId;
        $('a[href="#' + tabId + '"]').click();
        return rootEl;
    }, _getOpenTabIDs = function (rootEl) {
        var rootId = rootEl.attr('id'), tabsId = [];
        $('#' + rootId + '>ul>li').each(function (index, el) { index && tabsId.push($(el).children().last().attr('href').replace('#tab_', '')); });
        return tabsId;
    }, _tabAdapter = function () {
        var arg = arguments, argL = arg.length;
        switch (argL) {
            case 0:
                return this;
            case 1:
                if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]')
                    return _ini(this, arg[0]);
                else {
                    if (arg[0].toUpperCase() === 'GETOPENTABIDS')
                        return _getOpenTabIDs(this);
                    return this.tabs(arg[0]);
                }
            case 2:
                switch (arg[0].toUpperCase()) {
                    case 'CLOSETAB':
                        return _closeTab(this, arg[1]);
                    case 'ADDTAB':
                        return _addTab(this, arg[1]);
                    case 'ACTIVETAB':
                        return _activeTab(this, arg[1]);
                    default:
                        return this.tabs(arg[0], arg[1]);
                }
            default:
                return this.tabs.apply(this, arg);
        }
    };
    $._createPlugin('tabAdapter', _tabAdapter);
})(jQuery);