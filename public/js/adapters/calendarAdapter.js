(function ($) {
    $.custom.widgetAdapter('custom.calendarAdapter', {
        options: {
            calendar: $.calendars.instance(),// for specific lang, use it like this => $.calendars.instance('persian')
            renderer: $.calendarsPicker.themeRollerRenderer,
            prevText: '<span class="ui-icon ui-icon-circle-triangle-w"></span>',
            todayText: '<span class="ui-state-default ui-corner-all" style="padding: 1px 6px 1px 6px;">today</span>',
            nextText: '<span class="ui-icon ui-icon-circle-triangle-e"></span>',
            clearText: '<span class="ui-icon ui-icon-trash"></span>',
            closeText: '<span class="ui-icon ui-icon-close"></span>',
            showAnim: '',
            showTrigger: '<div class="ui-state-default ui-corner-all calendarTriggerBtn"><span class="ui-icon ui-icon-calendar"></span></div>',
            showOnFocus: true
        },
        _create: function () {
            this._basePluginName = 'calendarsPicker';
            return this.element[this._basePluginName](this.options);
        },
        getMilliDate: function () { // get millisecond
            var _dates = this.element[this._basePluginName]('getDate');
            return _dates.length ? Date.parse(_dates[0].toJSDate()) : null;
        },
        getJsDate: function () {
            var _dates = this.element[this._basePluginName]('getDate');
            return _dates.length ? _dates[0].toJSDate() : null;
        },
        _notFindMethod: function (paramArray) {
            return this.element[this._basePluginName].apply(this.element, paramArray);
        }
    });
})(jQuery);