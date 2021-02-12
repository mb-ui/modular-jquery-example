import service from './service.js';
import createCustomTreeview from './createCustomTreeview.js';
import savingSelected from './savingSelected.js';
const maxSelection = 4, homePageID = '6', tabPrefix = 'tab_', panelPrefix = 'panel_';
const _openTabByNodeID = function ($tabListRootElement, nodeObj, isSelectedTab) {
    const tabObj = {
        tabID: tabPrefix + nodeObj.id,
        panelID: panelPrefix + nodeObj.id,
        text: nodeObj.text,
        extarOptions: { jsModulePath: nodeObj.data.jsModulePath }
    };
    $tabListRootElement.tabAdapter('openTab', tabObj);
    if (isSelectedTab)
        $tabListRootElement.tabAdapter('selectTab', tabObj.tabID);
};
export default function ($panelElement) {
    const $horizentalTabsEl = $('#horizentalTabs');
    service.getTreeData().then(data => {
        const $customTreeview = createCustomTreeview({
            $treeEl: $('#sideMenuTree'),
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
        })
            .on('loaded.jstree', (function (e) {
                const checked = savingSelected.load();
                checked.unshift(homePageID);
                for (let i = 0, l = checked.length; i < l; i++) {
                    const nodeID = checked[i];
                    $(this).jstree('check_node', nodeID);
                    nodeID && _openTabByNodeID($horizentalTabsEl, $(this).jstree('get_node', nodeID));
                }
                $horizentalTabsEl.tabAdapter('selectTab', tabPrefix + homePageID);
                $('#sideMenuTreeSearchInput').change(e => { $(this).jstree('search', $(e.target).val()); });
            }))
            .on("uncheck_node.jstree", function (e, data) {
                savingSelected.save(data.selected);
            })
            .on("check_node.jstree", function (e, data) {
                savingSelected.save(data.selected);
            })
            .on('maxchecked.customjstree', function (e, data) {
                $(this).addClass('customTreeView-maxSelection');
            })
            .on('select_node.customjstree', function (e, data, checkedIDs) {  //single selection
                const { node } = data;
                $(this).removeClass('customTreeView-maxSelection');
                checkedIDs.map(checkedID => {
                    if (checkedID != node.id) {
                        $(this).jstree('uncheck_node', checkedID);
                        $horizentalTabsEl.tabAdapter('closeTab', tabPrefix + checkedID);
                    }
                });
                $(this).jstree('check_node', node.id);
                _openTabByNodeID($horizentalTabsEl, node, true);
            })
            .on('check_node.customjstree', function (e, data) {
                const { node } = data;
                _openTabByNodeID($horizentalTabsEl, node, true);
            })
            .on('uncheck_node.customjstree', function (e, data) {
                $(this).removeClass('customTreeView-maxSelection');
                $horizentalTabsEl.tabAdapter('closeTab', tabPrefix + data.node.id);
            })
            .on('folder_click.customjstree', function (e, $li) { $(this).jstree("toggle_node", $li); })
            .on('open_dialog.customjstree', function (e, node) {
                $$.importModule(node.data.jsModulePath).then(function (result) {
                    result.default({ baseID: '', panelElement: null, treeNodeObj: node });
                });
            });
        $horizentalTabsEl.on('tabsactivate', function (e, ui) {
            const selectedTabID = $horizentalTabsEl.tabAdapter('getTabID', ui.newTab);
            const checkedNodeID = selectedTabID.replace(tabPrefix, '');
            $customTreeview.jstree('deselect_all', true).jstree('select_node', checkedNodeID, true, true);
        }).on('onclose.tabAdapter', function (e, closeTabID) {
            const uncheckedNodeID = closeTabID.replace(tabPrefix, '');
            $customTreeview.jstree('uncheck_node', uncheckedNodeID).jstree('deselect_node', uncheckedNodeID).removeClass('customTreeView-maxSelection');
        }).on('beforefirstactivate.tabAdapter', function (e, ui) {
            var tabObj = $(this).tabAdapter('getTabObj', ui.newTab), $panelEl = ui.newPanel.append('<p>loading...</p>');
            $$.importModule(tabObj.extarOptions.jsModulePath).then(function (result) {
                $panelEl.empty();
                return result.default({
                    treeNodeObj: tabObj,
                    panelElement: $panelEl,
                    containerID: tabObj.tabID + '_'
                });
            });
        });
    });
}