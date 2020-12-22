import CreateForm from '../forms/create/index.js';
export default function ({ e, $gridEl }) {
    let form;
    $('<div>').dialogAdapter({
        extendedSetting: {
            url: 'js/modules/mockTab4WithDataGrid/forms/create/index.html',
            afterLoadTemplate: function ({ $dialogEl }) {
                form = new CreateForm($dialogEl);
            }
            , beforeLoadTemplate: function (param) { }
        },
        title: 'create dialog title',
        height: 700,
        width: '90%',
        buttons: {
            'ok': function () {
                var data = form.getValues();
                debugger;
                // sending data to server
            }
        }
    });
};