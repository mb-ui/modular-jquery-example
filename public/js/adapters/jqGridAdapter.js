(function ($) {
    function createInlineBtns(options, $el) {
        var str = '', btns = options.customSetting.inlineBtns.btns;
        $.each(btns, function (i) { str += i; });
        if (!str)
            return false;
        options.colNames.unshift(" ");
        options.colModel.unshift({
            name: " ",
            index: 'act',
            search: false,
            frozen: true,
            sortable: false,
            width: options.customSetting.inlineBtns.width || 300,
            formatter: function (a, b) {
                return '<div class="jqGridInlineBtn" rowId="' + b.rowId + '">' + str + '</div>';
            }
        });
        options.shrinkToFit = false;
        options.forceFit = false;
        $el.click(function (e) {
            var el = $(e.target), pEl = el.parent();
            pEl.hasClass('jqGridInlineBtn') && btns[el[0].outerHTML]({ e: e, $gridEl: $el, rowData: $el.jqGrid('getRowData', pEl.attr('rowId')) });
        });
        return true;
    }
    $.fn.extend({
        jqGridAdapter: function () {
            var arg = arguments, argL = arg.length;
            switch (argL) {
                case 0:
                    return this;
                case 1:
                    if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]') {
                        var options = arg[0], $el = this, containsInlineBtns, containsTopToolbarBtns;
                        options.rowNum = options.rowNum || 50;
                        options.rowList = options.rowList || [50, 100, 200];
                        options.pager || (options.scroll = 1);
                        (options.width || options.autowidth) || (options.autowidth = true);
                        options.customSetting && (function () {
                            var _setting = options.customSetting;
                            _setting.inlineBtns && (containsInlineBtns = createInlineBtns(options, $el));
                            if (_setting.topToolbarBtns) {
                                options.toolbar = [true, "top"];
                                containsTopToolbarBtns = true;
                            }
                        })();
                        $.each(options.colModel, function (i, value) {
                            if (value.name.trim() && ((value.search === undefined) || (value.search)))
                                value.hidden || (
                                    value.searchoptions = {
                                        sopt: ['eq', 'bw', 'bn', 'cn', 'nc', 'ew', 'en']
                                    }
                                );
                        });
                        $el.jqGrid($.extend({
                            mtype: "POST",
                            datatype: "json",
                            sortorder: "asc"
                        }, options, {
                            gridview: true,
                            viewrecords: true,
                            direction: 'rtl',
                            sortable: true,
                            rownumbers: true
                        })).jqGrid('filterToolbar', {
                            searchOperators: true,
                            autoSearch: true,
                            //beforeSearch: function (a,b,c) {
                            //    debugger;
                            //    //var that = this, postData = $el.jqGrid('getGridParam', 'postData');
                            //    return false;
                            //}
                        });
                        containsInlineBtns && $el.jqGrid('setFrozenColumns');
                        containsTopToolbarBtns && (function () {
                            var id = 't_' + $el.attr('id'), _set = options.customSetting, _btns = _set.topToolbarBtns, _temp = '', findEl = function ($el) {
                                if ($el.attr('id') === id)
                                    return [{ outerHTML: '' }];
                                var _el, p = $el;
                                while (!_el)
                                    (function () {
                                        var parent = p.parent(), parentId = parent.attr('id');
                                        if (parentId === id)
                                            _el = p;
                                        else
                                            p = parent;
                                    })();
                                return _el;
                            };
                            $.each(_btns, function (i) { _temp += i });
                            $("#" + id).append(_temp).click(function (e) {
                                var el = findEl($(e.target)), _temp = el[0].outerHTML;
                                _btns[_temp] && _btns[_temp]({ e: e, $gridEl: $el });
                            });
                        })();
                        options.pager && $el.navGrid(options.pager, {
                            edit: false,
                            add: false,
                            del: false,
                            search: false,
                            refresh: true
                        }).navButtonAdd(options.pager, {
                            caption: "Set Developed",
                            buttonicon: "ui-icon-circle-check",
                            position: "first",
                            title: "Set Developed",
                            onClickButton: function () {
                                var selRowIds = grid.jqGrid('getGridParam', 'selarrrow');
                                var data;
                                var image;
                                for (var i = 0; i < selRowIds.length; i++) {
                                    data = grid.getRowData(selRowIds[i]);
                                    image = "<img src='http://www.clker.com/cliparts/q/j/I/0/8/d/green-circle-icon-md.png' alt='green light' style='width:15px;height:15px'/>";
                                    data.Developed = image;
                                    $('#' + data.Country + ' [aria-describedby="pays_grid_Developed"]').html(image);
                                    grid.jqGrid("resetSelection");
                                    grid.jqGrid('setRowData', i, data[i]);
                                    grid.jqGrid('saveRow', i, false);
                                }
                            }
                        });
                        return $el;
                    } else {
                        return this.jqGrid(arg[0]);
                    }
                case 2:
                    if (arg[0].toUpperCase() === 'APPLYSEARCH') {
                        (function (param, $gridEl) {
                            var data = param.data, _searchOperation = param.operations, filters = { groupOp: 'AND', rules: [] }, p = $gridEl[0].p, topFilter = [], oldFilters = p.postData.filters;
                            p.search = true;
                            p.postData.filters && (filters = JSON.parse(p.postData.filters));
                            $.each(data, function (i, value) {
                                _searchOperation[i] || (_searchOperation[i] = 'cn');
                                topFilter.push({ field: i, op: _searchOperation[i], data: value });
                            });
                            for (var i = 0, l = topFilter.length; i < l; i++)
                                filters.rules.push(topFilter[i]);
                            filters = JSON.stringify(filters);
                            $.extend(p.postData, { filters: filters });
                            $gridEl.trigger("reloadGrid", [{ page: 1 }]);
                            p.postData.filters = oldFilters;
                        })(arg[1], this);
                        return this;
                    } else {
                        return this.jqGrid(arg[0], arg[1]);
                    }
                default:
                    return this.jqGrid.apply(this, arg);
            }
        }
    });
})(jQuery);
