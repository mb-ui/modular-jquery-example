(function ($) {
    $.custom.widgetAdapter('custom.validationAdapter', {
        options: {
            promptPosition: "topLeft",
            scroll: false
        },
        _create: function () {
            this._basePluginName = 'validationEngine';
            return this.element[this._basePluginName]('attach', this.options);
        },
        _notFindMethod: function (paramArray) {
            return this.element[this._basePluginName].apply(this.element, paramArray);
        }
    });
})(jQuery);
