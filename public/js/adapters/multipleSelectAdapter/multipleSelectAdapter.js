(function ($) {
    $.custom.widgetAdapter('custom.multipleSelectAdapter', {
        options: {
            formatAllSelected: function () { return 'All selected'; },
            formatSelectAll: function () { return 'Select all'; },
            formatNoMatchesFound: function () { return 'Not matches find'; },
            filter: true,
            dir: 'ltr',// additional option
            rtlClassName: 'multipleSelectAdapter-rtl',// additional option
            rootClassName: 'multipleSelectAdapter'// additional option
        },
        _create: function () {
            this._basePluginName = 'multipleSelect';
            if (this.options.dir === 'rtl')
                this._addClass(null, this.options.rtlClassName);
            this._addClass(null, this.options.rootClassName);
            return this.element[this._basePluginName](this.options);
        },
        _notFindMethod: function (paramArray) {
            return this.element[this._basePluginName].apply(this.element, paramArray);
        }
    });
})(jQuery);