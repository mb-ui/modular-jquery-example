const createCustomTreeview = function ({ $treeEl, jstreeOptions, extraOptions }) {
    jstreeOptions = createCustomTreeview._alterOptions(jstreeOptions);
    const { maxSelection } = createCustomTreeview._alterExtraOptions(extraOptions);
    $treeEl.addClass('customTreeview').jstree(jstreeOptions)
        .on("changed.jstree", function (e, data) {
            $treeEl.trigger('changed.customJStree', [data]);
            if (data.action === 'ready')
                return;
            if (!data.event) //manually checked
                return;
            if ($(data.event.originalEvent.target).hasClass('jstree-checkbox')) //checkbox click
                if (maxSelection && (data.selected.length > maxSelection))
                    $treeEl.jstree('deselect_node', data.node.id);
                else
                    data.node.state.selected ? $treeEl.trigger('check_node.customJStree', [data])
                        : $treeEl.trigger('uncheck_node.customJStree', [data]);
            else
                $treeEl.trigger('select_node.customJStree', [data]);
        })
        .on('click', function (e) {
            const el = $(e.target);
            if (el.is('li')) { // li click
                const className = el.children('a.jstree-anchor.custom_a_attr').first()[0].className;
                if (className.includes('folder'))
                    $treeEl.trigger('folder_click.customJStree', [$(e.target)]);
                else if (className.includes('dialog'))
                    $treeEl.trigger('open_dialog.customJStree', [$treeEl.jstree('get_node', el.attr('id'))]);
            }
        });
};
createCustomTreeview.defaultOptions = {
    nodeTypeIcons: {
        dialog: 'ui-icon ui-icon-newwin',
        folder: 'ui-icon ui-icon-folder-open',
        tab: 'ui-icon ui-icon-extlink'
    },
    extraOptions: {
        maxSelection: null
    }
};
createCustomTreeview._alterExtraOptions = function (op) {
    return $.extend(op || {}, this.defaultOptions.extraOptions);
};
createCustomTreeview._alterOptions = function (op) {
    op.plugins = op.plugins || [];
    const plugs = op.plugins;
    plugs.indexOf("checkbox") === -1 && plugs.push("checkbox");
    op = $.extend(op, {
        checkbox: {
            three_state: false,
            whole_node: false,
            tie_selection: true
        }
    });
    for (let i = 0, data = op.core.data, l = data.length; i < l; i++) {
        const _obj = data[i];
        if (_obj.extraData)
            _obj.data = _obj.extraData;
        if (_obj.customType) {
            _obj.icon = createCustomTreeview.defaultOptions.nodeTypeIcons[_obj.customType];
            _obj.a_attr = { class: `custom_a_attr ${_obj.customType}` };
        }
    }
    return op;
};
export default createCustomTreeview;