import api, { FormValidation } from '../../../shared/index.js';
import service from '../../services.js';
class CreateForm extends FormValidation {
    constructor(containerEl) {
        super(containerEl);

        this.day = containerEl.findByCodeAttr('Day');
        this.client = containerEl.findByCodeAttr('Client');
        this.amount = containerEl.findByCodeAttr('Amount');
        this.tax = containerEl.findByCodeAttr('Tax');
        this.notes = containerEl.findByCodeAttr('Notes');

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