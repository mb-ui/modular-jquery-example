(function ($) {
    $.extend($.validationEngine.defaults, { promptPosition: 'topLeft' });
    var _getDefaultOptions = function () {
        return {
            promptPosition: "topLeft", scroll: false
        };
    }, _validationAdapter = function () {
        var arg = arguments, argL = arg.length;
        switch (argL) {
            case 0:
                return this.validationEngine('attach', _getDefaultOptions());
            default:
                return this.validationEngine.apply(this, arg);
        }

    };
    $._createPlugin('validationAdapter', _validationAdapter);
})(jQuery);