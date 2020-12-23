import CreateForm from '../forms/create/index.js';
import service from '../services.js';
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
            'ok': function ({ $dialogEl }) {
                if (form.validate() === true) {
                    const data = form.getValues();
                    let message = 'new data : ';
                    $.each(data, (prop, value) => {
                        message += `  ${prop}=${value},`;
                    });
                    $dialogEl.dialogAdapter('close');
                    service.create(data);
                    alert(message);
                }
            }
        }
    });
};