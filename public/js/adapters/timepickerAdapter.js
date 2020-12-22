(function ($) {
    var _timepickerAdapter = function () {
        debugger;
        var arg = arguments, argL = arg.length;
        switch (argL) {
            case 0:
                return this.timepicker();
            case 1:
                if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]') {
                    var op = arg[0] || {};
                    op.change = op.change || function () { };
                    var onchange = op.change, options = $.extend({
                        timeFormat: 'HH:MM',
                        interval: 60,
                        dynamic: true,
                        dropdown: false,
                        scrollbar: true
                    }, op);
                    options.change = function (time) {
                        onchange(time);
                        var timepicker = $(this).timepicker();
                        timepicker.format && $(this).data('value', timepicker.format(time));
                    };
                    debugger;
                    return this.timepicker(options);
                }
                else
                    switch (arg[0].toUpperCase()) {
                        case 'GETVALUE': {
                            return this.data('value');
                        }
                        default:
                            return this.timepicker(arg[0]);
                    }
            case 2:
                switch (arg[0].toUpperCase()) {
                    case 'SETVALUE':
                        return this.val(arg[1]).blur().change();
                    default:
                        return this.timepicker(arg[0], arg[1]);
                }
            default:
                return this.timepicker.apply(this, arg);
        }
    };
    $._createPlugin('timepickerAdapter', _timepickerAdapter);
})(jQuery);