(function ($) {
    $.fn.extend({
        multipleSelectAdapter: function () {
            var arg = arguments, argL = arg.length;
            switch (argL) {
                case 0:
                    return this;
                case 1:
                    if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]')
                        return this.multipleSelect($.extend({
                            filter: true,
                            formatAllSelected: function () { return 'همه موارد'; },
                            formatSelectAll: function () { return 'انتخاب همه موارد'; },
                            formatNoMatchesFound: function () { return 'هیچ موردی یافت نشد.';}
                        }, arg[0]));
                    else
                        return this.multipleSelect(arg[0]);
                default:
                    return this.multipleSelect.apply(this, arg);
            }
        },
    });

})(jQuery);