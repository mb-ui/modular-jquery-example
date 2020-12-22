(function ($) {
    var _calendarAdapter = function () {
        var arg = arguments, argL = arg.length;
        switch (argL) {
            case 0:
                return this.calendarsPicker(_calendarAdapter._getDefaultOptions());
            case 1:
                if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]') {
                    return this.calendarsPicker($.extend(_calendarAdapter._getDefaultOptions(), arg[0] || {}));
                }
                else {
                    var param = arg[0].toUpperCase();
                    switch (param) {
                        case 'GETMILLISECDATE':
                            var _dates = this.calendarsPicker('getDate');
                            return _dates.length ? Date.parse(_dates[0].toJSDate()) : null;
                        case 'GETJSDATE':
                            var _dates = this.calendarsPicker('getDate');
                            return _dates.length ? _dates[0].toJSDate() : null;
                        default:
                            return this.calendarsPicker(arg[0]);
                    }
                }
            default:
                return this.calendarsPicker.apply(this, arg);
        }

    };
    $.extend(_calendarAdapter, {
        _getDefaultOptions: function () {
            return {
                calendar: $.calendars.instance(),
                renderer: $.calendarsPicker.themeRollerRenderer,
                prevText: '<span class="ui-icon ui-icon-circle-triangle-w"></span>',
                todayText: '<span class="ui-state-default ui-corner-all" style="padding: 1px 6px 1px 6px;">today</span>',
                nextText: '<span class="ui-icon ui-icon-circle-triangle-e"></span>',
                clearText: '<span class="ui-icon ui-icon-trash"></span>',
                closeText: '<span class="ui-icon ui-icon-close"></span>',
                showAnim: '',
                showTrigger: '<div class="ui-state-default ui-corner-all calendarTriggerBtn"><span class="ui-icon ui-icon-calendar"></span></div>',
                showOnFocus: true,
            };
        }
    });
    $._createPlugin('calendarAdapter', _calendarAdapter);
})(jQuery);