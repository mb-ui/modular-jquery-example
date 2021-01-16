import service from './service.js';
import createCustomTreeview from './createCustomTreeview.js';
import savingSelected from './savingSelected.js';
export default function ($panelElement) {
    const $treeEl = $('#sideMenuTree'), $horizentalTabsEl = $('#horizentalTabs'), maxSelection = 4, homePageID = '6';
    service.getTreeData().then(data => {
        createCustomTreeview({
            $treeEl,
            jstreeOptions: {
                plugins: ["search"],
                core: {
                    strings: {
                        'Loading ...': 'Loading ...'
                    },
                    data
                }
            },
            extraOptions: {
                maxSelection,//optional & default is null
            }
        });
        $treeEl
            .on('loaded.jstree', (function (e) {
                const checked = savingSelected.load();
                checked.unshift(homePageID);
                for (let i = 0, l = checked.length; i < l; i++) {
                    const nodeID = checked[i];
                    $treeEl.jstree('select_node', nodeID, true); // select without triggering "changed.jstree" event
                    nodeID && $horizentalTabsEl.tabAdapter('addTab', $(this).jstree('get_node', nodeID));
                }
                $horizentalTabsEl.tabAdapter('activeTab', homePageID);
            }))
            .on('select_node.jstree', function (e, data) {
                if (data.selected.length === maxSelection)
                    $(this).addClass('multiSelectOverflow');
                savingSelected.save(data.selected);
            })
            .on('deselect_node.jstree', function (e, data) {
                if (data.selected.length < maxSelection)
                    $(this).removeClass('multiSelectOverflow');
                savingSelected.save(data.selected);
            })
            .on('select_node.customJStree', function (e, data) {  //single selection
                const { node } = data, selectedId = data.selected[0];
                $(this).removeClass('multiSelectOverflow');
                $horizentalTabsEl.tabAdapter('getOpenTabIDs').map(function (value) {
                    if (value != selectedId) {
                        $horizentalTabsEl.tabAdapter('closeTab', value);
                    }
                });
                $horizentalTabsEl.tabAdapter('addTab', node).tabAdapter('activeTab', node.id);
            })
            .on('check_node.customJStree', function (e, data) {
                const { node } = data;
                $horizentalTabsEl.tabAdapter('addTab', node).tabAdapter('activeTab', node.id);
            })
            .on('uncheck_node.customJStree', function (e, data) { $horizentalTabsEl.tabAdapter('closeTab', data.node.id); })
            .on('changed.customJStree', function (e, data) { })
            .on('folder_click.customJStree', function (e, $li) { $(this).jstree("toggle_node", $li); })
            .on('open_dialog.customJStree', function (e, node) {
                $$.importModule(node.data.jsModulePath).then(function (result) {
                    result.default({ baseID: '', panelElement: null, treeNodeObj: node });
                });
            });
        $('#sideMenuTreeSearchInput').change(function () { $treeEl.jstree('search', $(this).val()); });
    });
}