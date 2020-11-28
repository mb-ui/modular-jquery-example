(function ($) {
    var _calendar, getDefaultOptions = function () {
        return {
            calendar: _calendar,
            renderer: $.calendarsPicker.themeRollerRenderer,
            prevText: '<span class="ui-icon ui-icon-circle-triangle-w"></span>',
            todayText: '<span class="ui-state-default ui-corner-all" style="padding: 1px 6px 1px 6px;">امروز</span>',
            nextText: '<span class="ui-icon ui-icon-circle-triangle-e"></span>',
            clearText: '<span class="ui-icon ui-icon-trash"></span>',
            closeText: '<span class="ui-icon ui-icon-close"></span>',
            showAnim: '',
            showTrigger: '<div class="ui-state-default ui-corner-all calendarTriggerBtn"><span class="ui-icon ui-icon-calendar"></span></div>',
            showOnFocus: true
        };
    };
    $.fn.extend({
        calendarAdapter: function () {
            var arg = arguments, argL = arg.length;
            _calendar = _calendar || $.calendars.instance('persian');
            switch (argL) {
                case 0:
                    return this.calendarsPicker(getDefaultOptions());
                case 1:
                    if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]')
                        return this.calendarsPicker($.extend(getDefaultOptions(), arg[0] || {}));
                    else {
                        var param = arg[0].toUpperCase();
                        switch (param) {
                            case 'GETENDATE':
                                return this.calendarsPicker('getDate')[0].toJSDate();
                            default:
                                return this.calendarsPicker(param);
                        }
                    }
                case 2:
                    var methodName = arg[0].toUpperCase();
                    switch (methodName) {
                        case 'SETFADATE':
                            var arr = arg[1].split('/');
                            arr.length === 1 && (arr = arg[1].split('-'));
                            return this.calendarsPicker('setDate', _calendar.newDate(parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2])));
                        default:
                            return this.calendarsPicker(methodName, arg[1]);
                    }
                default:
                    return this.calendarsPicker.apply(this, arg);
            }

        }
    });
})(jQuery);