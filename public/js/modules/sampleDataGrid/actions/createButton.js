import CreateForm from '../forms/create/index.js';
import service from '../services.js';
export default function (e) {
    let form;
    $('<div>').dialogAdapter({
        templateUrl: 'js/modules/sampleDataGrid/forms/create/index.html',
        afterloadtemplate: function (e, { data }) {
            $(this).append(data);
            form = new CreateForm($(this));
        },
        beforeloadtemplate: function () { },
        title: 'create dialog title',
        buttons: {
            'ok': function (e) {
                if (form.validate() === true) {
                    const data = form.getValues();
                    service.create(data);
                    let message = 'new data : ';
                    $.each(data, (prop, value) => {
                        message += `  ${prop}=${value},`;
                    });
                    alert(message);
                    $(this).dialogAdapter('close');
                }
            }
        }
    });
};