(function ($) {
    $.fn.extend({
        calendarAdapter: function () {
            var arg = arguments, argL = arg.length;
            switch (argL) {
                case 0:
                    return this.calendarsPicker($.fn.calendarAdapter.getDefaultOptions());
                case 1:
                    if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]') {
                        return this.calendarsPicker($.extend($.fn.calendarAdapter.getDefaultOptions(), arg[0] || {}));
                    }
                    else {
                        var param = arg[0].toUpperCase();
                        switch (param) {
                            case 'GETJSDATE':
                                return this.calendarsPicker('getDate')[0].toJSDate();
                            default:
                                return this.calendarsPicker(arg[0]);
                        }
                    }
                default:
                    return this.calendarsPicker.apply(this, arg);
            }

        }
    });
    $.extend($.fn.calendarAdapter, {
        getDefaultOptions: function () {
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
})(jQuery);