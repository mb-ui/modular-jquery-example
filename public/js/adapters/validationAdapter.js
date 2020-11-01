(function ($) {
    $.extend($.validationEngine.defaults, { promptPosition: 'topLeft'});
    var  getDefaultOptions = function () {
        return {
            promptPosition: "topLeft", scroll: false
        };
    };
    $.fn.extend({
        validationAdapter: function () {
            var arg = arguments, argL = arg.length;
            switch (argL) {
                case 0:
                    return this.validationEngine('attach', getDefaultOptions());
                default:
                    return this.validationEngine.apply(this, arg);
            }

        }
    });
})(jQuery);