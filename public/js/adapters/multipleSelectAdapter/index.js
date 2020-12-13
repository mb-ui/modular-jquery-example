(function ($) {
    $.fn.multipleSelect.localLang = $.fn.multipleSelect.localLang || {};
    function _multipleSelectAdapter() {
        var arg = arguments, argL = arg.length;
        switch (argL) {
            case 0:
                return this;
            case 1:
                if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]') {
                    var op = $.extend({ filter: true, dir: 'ltr' }, $.fn.multipleSelect.localLang, arg[0]);
                    op.dir === 'rtl' && (this.hasClass('multipleSelectAdapter-rtl') || this.addClass('multipleSelectAdapter-rtl'));
                    return this.multipleSelect(op);
                }
                else
                    return this.multipleSelect(arg[0]);
            default:
                return this.multipleSelect.apply(this, arg);
        }
    };
    $._createPlugin('multipleSelectAdapter', _multipleSelectAdapter);
})(jQuery);