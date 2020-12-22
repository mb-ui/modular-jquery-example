import api from '../shared/index.js';
let horizentalTabsEl;
function createTree(dataTree) {
    horizentalTabsEl = horizentalTabsEl || $('#horizentalTabs');
    dataTree = {
        plugins: ["checkbox", "search"],
        core: {
            strings: {
                'Loading ...': 'در حال بارگذاری ...'
            },
            data: (function () {
                var rootID = "023BE4D3-929B-45D6-AA14-E71899049EB9", data = [{
                    text: "Menu",
                    id: rootID,
                    parent: "#",
                    icon: "ui-icon ui-icon-folder-open",
                    a_attr: { "class": "no_checkbox folder" }
                }], icons = {
                    dialog: 'ui-icon ui-icon-newwin',
                    folder: 'ui-icon ui-icon-folder-open',
                    tab: 'ui-icon ui-icon-extlink'
                };
                for (var i = 0, _data = dataTree.data, l = _data.length; i < l; i++)
                    data.push({
                        text: _data[i].title,
                        id: _data[i].id,
                        parent: _data[i].parentId || rootID,
                        data: { modulePath: _data[i].jsModulePath, tooltip: _data[i].tooltip, cssIconClass: _data[i].cssIconClass },
                        icon: icons[_data[i].type],
                        a_attr: { class: ['dialog', 'folder'].indexOf(_data[i].type) >= 0 ? ('no_checkbox ' + _data[i].type) : _data[i].type }
                    });
                return data;
            })()
        },
        checkbox: {
            three_state: false, // to avoid that fact that checking a node also check others
            whole_node: false,  // to avoid checking the box just clicking the node
            tie_selection: true// for checking without selecting and selecting without checking
        },
    };
    var treeEl = $('#sideMenuTree'), limitSelectedManager = {
        count: 0,
        max: parseInt(treeEl.attr('limit')),
        plus: function () {
            this.count++;
            this.isMaxCount();
        },
        minus: function () {
            this.count--;
            this.isMaxCount();
        },
        setOne: function () {
            this.count = 1;
            this.isMaxCount();
        },
        isMaxCount: function () {
            if (this.count >= this.max)
                treeEl.addClass('multiSelectOverflow');
            else
                treeEl.removeClass('multiSelectOverflow');
        }
    };

    treeEl.jstree(dataTree).on('loaded.jstree', (function () {
        var flag = -1;
        return function (e) {
            flag++;
            if (flag)
                horizentalTabsEl.tabAdapter('getOpenTabIDs').map(function (value) {
                    treeEl.jstree('select_node', value);
                });
            else {
                var _openDialogIDs = (localStorage.getItem("openTabIDs") || '').split(',');
                for (var i = 0, l = _openDialogIDs.length; i < l; i++)
                    treeEl.jstree('select_node', _openDialogIDs[i]);
            }
        };
    })());
    $('#sideMenuTreeSearchInput').change(function () {
        var api = treeEl.jstree(true);
        api.search($(this).val());
    });
    var openDialog = function (node) {
        $$.importModule(node.data.modulePath).then(function (result) {
            result.default({ baseID: '', panelElement: null, treeNodeObj: node });
        });
    };
    $('#sideMenuTree').on("changed.jstree", (function () {
        var childTab = (function () {
            var multipleSelect = function (node, ev) {
                if (node.state.selected) {
                    if (treeEl.hasClass('multiSelectOverflow')) {
                        limitSelectedManager.plus();
                        treeEl.jstree('deselect_node', node.id);
                        return;
                    }
                    horizentalTabsEl.tabAdapter('addTab', node);
                    ev && horizentalTabsEl.tabAdapter('activeTab', node.id);
                    limitSelectedManager.plus();
                } else {
                    horizentalTabsEl.tabAdapter('closeTab', node.id);
                    limitSelectedManager.minus();
                }
            },
                singleSelect = function (openTabsId, node, data) {
                    limitSelectedManager.setOne();
                    var selectedId = data.selected[0];
                    openTabsId.map(function (value) {
                        if (value != selectedId) {
                            horizentalTabsEl.tabAdapter('closeTab', value);
                        }
                    });
                    horizentalTabsEl.tabAdapter('addTab', node).tabAdapter('activeTab', node.id);
                };
            return function (data, node) {
                if (!data.event || $(data.event.originalEvent.target).hasClass('jstree-checkbox')) {
                    multipleSelect(node, data.event);
                } else {
                    singleSelect(horizentalTabsEl.tabAdapter('getOpenTabIDs'), node, data);
                }
            };
        })();
        return function (e, data) {
            if (data.action === 'ready') {
                return;
            }
            var node = data.node, type = node.a_attr.class;
            type = type.replace('no_checkbox', '').trim();
            switch (type) {
                case 'folder': {
                    break;
                }
                case 'dialog': {
                    openDialog(node);
                    break;
                }
                case 'tab': {
                    childTab(data, node);
                    break;
                }
                default: {
                    throw 'sideMenu node with ' + type + ' type is not valid !';
                }
            }
        };
    })()).on('click', function (e) {
        var el = $(e.target);
        if (el.is('li') && el.children().last().hasClass('dialog')) {
            openDialog(treeEl.jstree('get_node', el.attr('id')));
        }
    });
}
export default function (panelElement) {
    api.getResources(['json/sampleTreeMenuData.json']).done(([data]) => {
        createTree(data);
    });
}