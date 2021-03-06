﻿import createBtn from './actions/createButton.js';
import printBtn from './actions/printButton.js';
import updateBtn from './actions/updateButton.js';
import deleteBtn from './actions/deleteButton.js';
import SearchFrom from './forms/externalSearch/index.js';
import services from './services.js';
import api from '../shared/index.js';
export default function ({ panelElement: pEl, containerID }) {
    return api.getResources(['js/modules/sampleDataGrid/index.html', 'js/modules/sampleDataGrid/forms/externalSearch/index.html'])
        .then(function ([gridTemplate, exteranlSearchTemplate]) {
            pEl.empty().append(exteranlSearchTemplate + gridTemplate);
            const $gridEl = pEl.findByCodeAttr('grid');
            const searchFrom = new SearchFrom(pEl);
            $gridEl.gridAdapter({
                topToolbarBtns: {
                    [api.templates.gridTopToolbarBtns.create]: createBtn
                    , [api.templates.gridTopToolbarBtns.print]: printBtn
                },
                inlineBtns: {
                    [api.templates.gridInlineBtns.update]: updateBtn
                    , [api.templates.gridInlineBtns.delete]: deleteBtn
                },
                //url: location.href + 'Home/GetUserData',
                loadonce: true,
                data: services.getLocalDataGrid(),
                datatype: 'local',
                height: '320',
                //multiselect: true,
                autowidth: true,
                direction: 'rtl',
                colNames: ['ID', 'Hidden Day', 'Day', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
                colModel: [{
                    name: 'id',
                    hidden: true,
                    search: false
                }, {
                    name: 'day',
                    hidden: true
                }, {
                    name: 'dayString',
                    width: 200,
                }, {
                    name: 'client',
                }, {
                    name: 'amount',
                    width: 200
                }, {
                    name: 'tax',
                    width: 200
                }, {
                    name: 'total',
                    width: 200
                }, {
                    name: 'notes',
                    width: 400
                }],
                pager: pEl.findByCodeAttr('grid_pager'),// it can be '#'+pagerID or pager jquery Element,
                sortname: 'day',
                caption: 'data grid title'
            });
            pEl.findByCodeAttr('searchSubmit').click(function (e) {
                if (searchFrom.validate())
                    $gridEl.gridAdapter('applyExternalSearch', searchFrom.getGridFilters());
            });
        });
}