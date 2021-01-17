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
                    $treeEl.jstree('check_node', nodeID);
                    nodeID && $horizentalTabsEl.tabAdapter('addTab', $(this).jstree('get_node', nodeID));
                }
                $horizentalTabsEl.tabAdapter('selectTab', homePageID);
            }))
            .on("uncheck_node.jstree", function (e, data) {
                savingSelected.save(data.selected);
            })
            .on("check_node.jstree", function (e, data) {
                savingSelected.save(data.selected);
            })
            .on('maxchecked.customJStree', function (e, data) {
                $(this).addClass('multiSelectOverflow');
            })
            .on('select_node.customJStree', function (e, data, checkedIDs) {  //single selection
                const { node } = data, $treeEl = $(this).removeClass('multiSelectOverflow');
                checkedIDs.map(function (checkedID) {
                    if (checkedID != node.id) {
                        $treeEl.jstree('uncheck_node', checkedID);
                        $horizentalTabsEl.tabAdapter('closeTab', checkedID);
                    }
                });
                $treeEl.jstree('check_node', node.id);
                $horizentalTabsEl.tabAdapter('addTab', node).tabAdapter('selectTab', node.id);
            })
            .on('check_node.customJStree', function (e, data) {
                const { node } = data;
                $horizentalTabsEl.tabAdapter('addTab', node).tabAdapter('selectTab', node.id);
            })
            .on('uncheck_node.customJStree', function (e, data) {
                $(this).removeClass('multiSelectOverflow');
                $horizentalTabsEl.tabAdapter('closeTab', data.node.id);
            })
            .on('folder_click.customJStree', function (e, $li) { $(this).jstree("toggle_node", $li); })
            .on('open_dialog.customJStree', function (e, node) {
                $$.importModule(node.data.jsModulePath).then(function (result) {
                    result.default({ baseID: '', panelElement: null, treeNodeObj: node });
                });
            });
        $('#sideMenuTreeSearchInput').change(function () { $treeEl.jstree('search', $(this).val()); });
    });
}