import service from './service.js';
import createCustomTreeview from './createCustomTreeview.js';
export default function (panelElement) {
    const treeEl = $('#sideMenuTree'), horizentalTabsEl = $('#horizentalTabs'), maxSelection = 4;
    service.getTreeData().then(data => {
        createCustomTreeview({
            treeEl,
            jstreeOptions: {
                plugins: ["search"],
                core: {
                    strings: {
                        'Loading ...': 'Loading ...'
                    },
                    data
                }
            },
            maxSelection
        });
        treeEl
            .on('changed.customJStree', function (e, data) { })
            .on('loaded.jstree', (function (e) {
                const _openDialogIDs = (localStorage.getItem("openTabIDs") || '').split(',');
                for (var i = 0, l = _openDialogIDs.length; i < l; i++) {
                    const nodeID = _openDialogIDs[i];
                    treeEl.jstree('select_node', nodeID, true);
                    nodeID && horizentalTabsEl.tabAdapter('addTab', treeViewApi.get_node(nodeID));
                }
            }))
            .on('deselect_node.jstree', function (e, data) {
                if (data.selected.length < maxSelection)
                    $(this).removeClass('multiSelectOverflow');
            })
            .on('select_node.jstree', function (e, data) {
                if (data.selected.length === maxSelection)
                    $(this).addClass('multiSelectOverflow');
            })
            .on('select_node.customJStree', function (e, data) {  //single selection
                const { node } = data, selectedId = data.selected[0];
                $(this).removeClass('multiSelectOverflow');
                horizentalTabsEl.tabAdapter('getOpenTabIDs').map(function (value) {
                    if (value != selectedId) {
                        horizentalTabsEl.tabAdapter('closeTab', value);
                    }
                });
                horizentalTabsEl.tabAdapter('addTab', node).tabAdapter('activeTab', node.id);
            })
            .on('check_node.customJStree', function (e, data) {
                const { node } = data;
                horizentalTabsEl.tabAdapter('addTab', node);
                horizentalTabsEl.tabAdapter('activeTab', node.id);
            })
            .on('uncheck_node.customJStree', function (e, data) {
                const { node } = data;
                horizentalTabsEl.tabAdapter('closeTab', node.id);
            })
            .on('open_dialog.customJStree', function (e, node) {
                $$.importModule(node.data.jsModulePath).then(function (result) {
                    result.default({ baseID: '', panelElement: null, treeNodeObj: node });
                });
            })
            .on('folder_click.customJStree', function (e, $li) {
                $(this).jstree("toggle_node", $li);
            });
        const treeViewApi = treeEl.jstree(true);
        $('#sideMenuTreeSearchInput').change(function () { treeViewApi.search($(this).val()); });
    });
}