(function ($) {
    $.extend($.fn.calendarAdapter, {
        getDefaultOptions: function () {
            return {
                calendar: $.calendars.instance('persian'),
                renderer: $.calendarsPicker.themeRollerRenderer,
                prevText: '<span class="ui-icon ui-icon-circle-triangle-w"></span>',
                todayText: '<span class="ui-state-default ui-corner-all" style="padding: 1px 6px 1px 6px;">امروز</span>',
                nextText: '<span class="ui-icon ui-icon-circle-triangle-e"></span>',
                clearText: '<span class="ui-icon ui-icon-trash"></span>',
                closeText: '<span class="ui-icon ui-icon-close"></span>',
                showAnim: '',
                showTrigger: '<div class="ui-state-default ui-corner-all calendarTriggerBtn"><span class="ui-icon ui-icon-calendar"></span></div>',
                showOnFocus: true,
                isRTL: true
            };
        }
    });
})(jQuery);