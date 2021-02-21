(function ($) {
    $.custom.widgetAdapter('custom.gridAdapter', {
        _privateOptions: {
            inlineBtnClass: 'gridAdapter-Inlinebuttons',
            toolbarBtnClass: 'gridAdapter-toolbarbuttons',
            inlineBtnTemplate: '<span class="@class" _index="@_index" rowId="@rowId">@content</span>',
            toolbarBtnTemplate: '<span class="@class" _index="@_index">@content</span>'
        },
        options: {
            //****************** extended options ******************
            defaultColMode: {
                search: true,
                searchoptions: {
                    searchOnEnter: true,
                    sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en', 'cn', 'nc'],
                }
            },
            defaultNavigatorOptions: {
                edit: false,
                add: false,
                del: false,
                search: false,
                refreshstate: 'current',
                refresh: true
            },
            defaultFilterToolbar: {
                searchOperators: true,
                autoSearch: true,
            },
            //when it's true, it automatically calls $el.jqgrid('setFrozenColumns') after initializing
            autoSetFrozenColumns: true,
            // ex=> { "<span class='ui-icon ui-icon-pencil'></span>":function(e){ // do sth here. },
            //"<span class='ui-icon ui-icon-trash'></span>":function(e){ // do sth here. } }
            inlineBtns: null,
            inlineBtnsColWidth: 70, // it works if inlineBtns options would not be null.
            // ex=> { "<span class='ui-icon ui-icon-plus'></span>":function(e){ // do sth here. }},
            topToolbarBtns: null,

            //****************** built-in options ******************
            toolbar: [true, "top"],
            mtype: "POST",
            datatype: "json",
            sortorder: "asc",
            gridview: true,
            viewrecords: true,
            sortable: true,
            rownumbers: true,
            rowNum: 50,
            rowList: [50, 100, 200]
        },
        _create: function () {
            var _op = this.options;
            this._basePluginName = 'jqGrid';
            this._checkPager(_op)._alterColModel(_op)._checkInlineButtons(_op);
            this.element[this._basePluginName](_op); // initialize plugin
            _op.pager && this.element[this._basePluginName]('navGrid', _op.pager, _op.defaultNavigatorOptions); // create pager element
            return this._checkFrozenColumns(_op)._checkFilterToolbar(_op)._checkTopToolbarButtons(_op);
        },
        applyExternalSearch: function (param) {
            var filters, p = this.element[0].p, oldFilters = p.postData.filters;
            p.search = true;
            filters = oldFilters ? JSON.parse(oldFilters) : { groupOp: 'AND', rules: [] };
            filters.rules = filters.rules.concat(param);
            $.extend(p.postData, { filters: JSON.stringify(filters) });
            this.element.trigger("reloadGrid", [{ page: 1 }]);
            p.postData.filters = oldFilters;
            return this;
        },
        _checkPager: function (options) {
            if (options.pager && typeof options.pager === 'object') {
                // pager option can be jqurey element then it automatically sets an unique Id on pager element.
                this._setPagerID(options.pager);
            } else {
                options.scroll = 1;
            }
            return this;
        },
        _checkFrozenColumns: function (options) {
            options.autoSetFrozenColumns && this.element[this._basePluginName]('setFrozenColumns');
            return this;
        },
        _checkFilterToolbar: function (op) {
            var toolbar = op.toolbar;
            if (toolbar.constructor === Array && toolbar[0] === true)
                this.element[this._basePluginName]('filterToolbar', op.defaultFilterToolbar);
            return this;
        },
        _alterColModel: function (op) {
            $.each(op.colModel, function (i, value) {
                op.colModel[i] = $.extend(true, {}, op.defaultColMode, value);
            });
            return this;
        },
        _setPagerID: function ($pagerEl) {
            var pagerID = 'pager_' + $.now();
            $pagerEl.attr('id', pagerID);
            this.options.pager = '#' + pagerID;
        },
        _checkInlineButtons: function (options) {
            options.inlineBtns && this._addInlineButtons(options, this._privateOptions, options.inlineBtns);
            return this;
        },
        _addInlineButtons: function (options, _privateOptions, btns) {
            var str = '', that = this, btnsCallbacks = [];
            inlineBtnTemplate = _privateOptions.inlineBtnTemplate.replace('@class', _privateOptions.inlineBtnClass);
            $.each(btns, function (i) {// concat buttons templates and create a single template
                str += inlineBtnTemplate.replace('@content', i).replace('@_index', btnsCallbacks.length);
                btnsCallbacks.push(btns[i]);
            });
            if (!str) { return this; }
            options.colNames.unshift(" ");
            options.colModel.unshift({
                name: " ",
                index: 'act',
                search: false,
                frozen: true,
                sortable: false,
                width: options.inlineBtnsColWidth,
                formatter: function (a, b) {
                    return str.split('@rowId').join(b.rowId);
                }
            });
            options.shrinkToFit = false;
            options.forceFit = false;
            this.element.on('click', '.' + _privateOptions.inlineBtnClass, function (e) {
                btnsCallbacks[parseInt($(this).attr('_index'))].call(that.element, e, $(this).attr('rowId'));
            });
            return this;
        },
        _checkTopToolbarButtons: function (op) {
            if (op.topToolbarBtns && op.toolbar.constructor === Array && op.toolbar[0] === true)
                return this._addTopToolbarButtons(this._privateOptions, op.topToolbarBtns);
            return this;
        },
        _addTopToolbarButtons: function (_privateOptions, btns) {
            var str = '', that = this, btnsCallbacks = [];
            toolbarBtnTemplate = _privateOptions.toolbarBtnTemplate.replace('@class', _privateOptions.toolbarBtnClass);
            $.each(btns, function (i) {// concat buttons templates and create a single template
                str += toolbarBtnTemplate.replace('@content', i).replace('@_index', btnsCallbacks.length);
                btnsCallbacks.push(btns[i]);
            });
            if (!str) { return this; }
            $('#t_' + this.element.attr('id')).append(str).on('click', '.' + _privateOptions.toolbarBtnClass, function (e) {
                btnsCallbacks[parseInt($(this).attr('_index'))].call(that.element, e);
            });
            return this;
        },
        _notFindMethod: function (paramArray) {
            return this.element[this._basePluginName].apply(this.element, paramArray);
        }
    });
})(jQuery);
