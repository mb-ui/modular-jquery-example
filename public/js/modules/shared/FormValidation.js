class FormValidation {
    constructor(containerEl, formCode = 'form') {
        this.formEl = containerEl.findByCodeAttr(formCode);
        this.formEl.validationAdapter();
    }
    validate() {
        return this.formEl.validationAdapter('validate');
    }
}
export default FormValidation;