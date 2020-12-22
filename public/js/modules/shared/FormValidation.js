class FormValidation {
    constructor(containerEl, formCode = 'form') {
        this.formEl = containerEl._findByCode(formCode);
        this.formEl.validationAdapter();
    }
    validate() {
        return this.formEl.validationAdapter('validate');
    }
}
export default FormValidation;