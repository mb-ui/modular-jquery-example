class Accessors {
    constructor() {
        this.Country = '';
        this.Capital = '';
        this.Code = '';
        this.Date = '';
        this.Developed = '';
        this.FromTime = '';
        this.ToTime = '';
    }
    init($rootElement) {
        this.Country = $rootElement._findByCode('Country');
        this.Capital = $rootElement._findByCode('Capital');
        this.Code = $rootElement._findByCode('Code');
        this.Date = $rootElement._findByCode('Date');
        this.Developed = $rootElement._findByCode('Developed');
        this.FromTime = $rootElement._findByCode('FromTime');
        this.ToTime = $rootElement._findByCode('ToTime');

        this.Date.calendarAdapter();
        this.FromTime.timepickerAdapter({});
        this.ToTime.timepickerAdapter({}).timepickerAdapter('setValue', '16:05');
    }
    getValues() {
        return {
            Country: this.Country.val(),
            Capital: this.Capital.val(),
            Date: this.Date.calendarAdapter('getJSDate'),
            Code: this.Code.val(),
            Developed: this.Developed.val(),
            FromTime: this.FromTime.timepickerAdapter('getValue'),
            ToTime: this.ToTime.timepickerAdapter('getValue')
        };
    }
    setValues(obj) {
        this.Country.val(obj.Country);
        this.Capital.val(obj.Capital);
        this.Code.val(obj.Code);
        this.Developed.val(obj.Developed);
        this.Date.calendarAdapter('setDate', obj.Date);
        this.FromTime.timepickerAdapter('setValue', obj.FromTime);
        this.ToTime.timepickerAdapter('setValue', obj.ToTime);
    }
    getOperations() {
        return {};
    }
}
const accessor = new Accessors();
export default accessor;