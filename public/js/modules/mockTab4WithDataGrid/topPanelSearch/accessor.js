class Accessors {
    constructor() {
        this.Country = '';
        this.Capital = '';
        this.PhoneNumber = '';
        this.FromDate = '';
        this.Sex = '';
        this.form = '';
    }
    init($rootEl) {
        this.Country = $rootEl._findByCode('Country');
        this.Capital = $rootEl._findByCode('Capital');
        this.PhoneNumber = $rootEl._findByCode('PhoneNumber');
        this.FromDate = $rootEl._findByCode('FromDate');
        this.Sex = $rootEl._findByCode('Sex');
        this.form = $rootEl._findByCode('form');
        this.form.validationAdapter();
        this.FromDate.calendarAdapter();
        this.Sex.multipleSelectAdapter({
            data: [
                { text: 'مرد', value: 1 },
                { text: 'زن', value: 1 }
            ]
        });
        this.PhoneNumber.multipleSelectAdapter({
            filter: true,
            dir: 'rtl',
            multiple: true,
            data: [
                { text: 'موبایل ۱', value: 1 },
                { text: 'موبایل ۲', value: 2 },
                { text: 'ثابت ۱', value: 3 },
                { text: 'ثابت ۲', value: 4 }
            ]
        });
    }
    getValues() {
        return {
            Country: this.Country.val(),
            Capital: this.Capital.val(),
            FromDate: this.FromDate.calendarAdapter('getJSDate'),
            Sex: this.Sex.multipleSelectAdapter('getSelects', 'value'),
            PhoneNumber: this.PhoneNumber.multipleSelectAdapter('getSelects', 'value')
        };
    }
    setValues(obj) {
        this.Country.val(obj.Country);
        this.PhoneNumber.multipleSelectAdapter('setSelects', obj.PhoneNumber);
        this.FromDate.calendarAdapter('setDate', obj.FromDateString);
    }
    getOperations() {
        return {
            Country: 'cn',
            Capital: 'cn',
            FromDate: 'cn',
            Sex: 'cn',
            PhoneNumber: 'cn'
        };
    }
    validate() {
        return this.form.validationAdapter('validate');
    }
}
const accessor = new Accessors();
export default accessor;