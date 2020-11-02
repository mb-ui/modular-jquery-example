import simpleLocalData from './simpleLocalData.js';
import searchAccessor from './topPanelSearch/accessor.js';
import search from './topPanelSearch/index.js';
import createDialog from './createDialog/index.js';
import api from '../shared/api/index.js';
export default function ({ panelElement: pEl, treeNodeObj, containerID }) {
    return api.getResources(['js/modules/user/index.html', 'js/modules/user/topPanelsearch/index.html'])
        .then(function ([indexHtml, searchHtml]) {
            pEl.empty().append(searchHtml).append(indexHtml);
            const $gridEl = pEl.findByCode('grid');
            $gridEl.jqGridAdapter({
                customSetting: {
                    topToolbarBtns: {
                        '<button class="ui-button ui-widget ui-corner-all jqGridTopToolbarBtn"><span class="ui-icon ui-icon-plus"></span>جدید</button>': createDialog
                        , '<button class="ui-button ui-widget ui-corner-all jqGridTopToolbarBtn"><span class="ui-icon ui-icon-print"></span>چاپ</button>': function ({ e, $gridEl }) { }
                    },
                    inlineBtns: {
                        width: 80,
                        btns: {
                            '<span class="ui-icon ui-icon-pencil"></span>': function ({ e, rowData, $gridEl }) { }
                            , '<span class="ui-icon ui-icon-trash"></span>': function ({ e, rowData, $gridEl }) { }
                        }
                    }
                },
                //url: location.href + 'Home/GetUserData',
                loadonce: true,
                data: simpleLocalData(),
                datatype: 'local',
                height: '200',
                multiselect: true,
                colNames: ['Country', 'Country Code', 'Developed', 'Capital', 'Date'],
                colModel: [{
                    name: 'Country',
                    key: true,
                    width: 200
                }, {
                    name: 'Code',
                }, {
                    name: 'Developed',
                    formatter: function () {
                        return "<span>this is an image</span>";
                    },
                    width: 200
                }, {
                    name: 'Capital',
                    width: 200
                }, {
                    name: 'Date',
                    width: 200
                }],
                pager: pEl.findByCode('grid_pager').attr('id', `${containerID}grid_pager`).attr('id'),
                sortname: 'Country',
                caption: treeNodeObj.text
            });
            searchAccessor.init(pEl);
            searchAccessor.setValues({
                Capital: '',
                Country: '',
                PhoneNumber: [1, 3],
                FromDateString: '1399/6/13'
            });
            pEl.findByCode('searchSubmit').click(function (e) {
                //searchSubmitClick({ searchAccessor, $gridEl });

                //form.validationEngine('attach', {
                //    validationEventTrigger: "blur",
                //    scroll: true,
                //    focusFirstField: true,
                //    showPrompts: true
                //}).validationEngine();
                var result = searchAccessor.validate();
                $gridEl.jqGridAdapter('applySearch', { data: searchAccessor.getValues(), operations: searchAccessor.getOperations() });
            });
        });
}