import api, { FormValidation } from '../../../shared/index.js';
import service from '../../services.js';
class CreateForm extends FormValidation {
    constructor(containerEl) {
        super(containerEl);

        this.day = api.getElementByCody(containerEl, 'Day');
        this.client = api.getElementByCody(containerEl, 'Client');
        this.amount = api.getElementByCody(containerEl, 'Amount');
        this.tax = api.getElementByCody(containerEl, 'Tax');
        this.notes = api.getElementByCody(containerEl, 'Notes');

        this.day.calendarAdapter();
        service.getClientData().then(data => { this.client.multipleSelectAdapter({ data, dir: 'rtl' }); });
        service.getNotesData().then(data => { this.notes.multipleSelectAdapter({ data, dir: 'rtl' }); });
    }
    getValues() {
        return {
            day: this.day.calendarAdapter('getMilliDate'),
            dayString: this.day.val(),
            amount: this.amount.val(),
            tax: this.tax.val(),
            client: this.client.multipleSelectAdapter('getSelects', 'value'),
            notes: this.notes.multipleSelectAdapter('getSelects', 'value')
        };
    }
    setValues(obj) {
        this.day.calendarAdapter('setDate', obj.day);
        this.amount.val(obj.amount);
        this.tax.val(obj.tax);
        this.notes.multipleSelectAdapter('setSelects', obj.notes);
        this.client.multipleSelectAdapter('setSelects', obj.client);
        return this;
    }
    clearValues() {
        return this.setValues({ day: '', client: '', amount: '', tax: '', notes: '' });
    }
}
export default CreateForm;