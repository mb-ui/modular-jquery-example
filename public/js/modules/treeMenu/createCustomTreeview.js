const
    _defaultOptions = {
        nodeTypeIcons: {
            dialog: 'ui-icon ui-icon-newwin',
            folder: 'ui-icon ui-icon-folder-open',
            tab: 'ui-icon ui-icon-extlink'
        },
        extraOptions: {
            maxSelection: null
        }
    }
    , _alterExtraOptions = function (op) {
        return $.extend(_defaultOptions.extraOptions, op || {});
    }
    , _alterJstreeOptions = function (op) {
        op.plugins = op.plugins || [];
        const plugs = op.plugins;
        plugs.indexOf("checkbox") === -1 && plugs.push("checkbox");
        op = $.extend(op, {
            checkbox: {
                three_state: false,
                whole_node: false,
                tie_selection: false
            }
        });
        for (let i = 0, data = op.core.data, l = data.length; i < l; i++) {
            const _obj = data[i];
            if (_obj.extraData)
                _obj.data = _obj.extraData;
            if (_obj.customType) {
                _obj.icon = _defaultOptions.nodeTypeIcons[_obj.customType];
                _obj.a_attr = { class: `custom_a_attr ${_obj.customType}` };
            }
        }
        return op;
    }
    , createCustomTreeview = function ({ $treeEl, jstreeOptions, extraOptions }) {
        jstreeOptions = _alterJstreeOptions(jstreeOptions);
        const { maxSelection } = _alterExtraOptions(extraOptions);
        $treeEl.addClass('customTreeview').jstree(jstreeOptions)
            .on('select_node.jstree', function (e, data) {
                const { event } = data;
                // if node is not selected programmatically
                if (typeof event === 'object' && event !== null)
                    $treeEl.trigger('select_node.customjstree', [data, $treeEl.jstree('get_checked', false)]);
            })
            .on('check_node.jstree', function (e, data) {
                const { node, event } = data, checked = $treeEl.jstree('get_checked', false).length;
                if (maxSelection && (checked === maxSelection))
                    $treeEl.trigger('maxchecked.customjstree', [data]);
                if (maxSelection && (checked > maxSelection))
                    $treeEl.jstree('uncheck_node', node.id);
                else
                    (typeof event === 'object' && event !== null) && $treeEl.trigger('check_node.customjstree', [data]);
            })
            .on('uncheck_node.jstree', function (e, data) {
                const { event } = data;
                // if node is not unchecked programmatically
                if (typeof event === 'object' && event !== null)
                    $treeEl.trigger('uncheck_node.customjstree', [data]);
            })[0]
            .addEventListener("click", function (e) {
                const $el = $(e.target);
                if ($el.hasClass('folder') || $el.hasClass(_defaultOptions.nodeTypeIcons.folder)) {
                    $treeEl.trigger('folder_click.customjstree', [$el]);
                    e.stopPropagation();
                } else if ($el.hasClass('dialog')) {
                    $treeEl.trigger('open_dialog.customjstree', [$treeEl.jstree('get_node', $el.attr('id'))]);
                    e.stopPropagation();
                } else if ($el.hasClass(_defaultOptions.nodeTypeIcons.dialog)) {
                    $treeEl.trigger('open_dialog.customjstree', [$treeEl.jstree('get_node', $el.parent().attr('id'))]);
                    e.stopPropagation();
                }
            }, true);
        return $treeEl;
    };
export default createCustomTreeview;