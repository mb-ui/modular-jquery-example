(function ($) {
    $.fn.multipleSelect.localLang = $.fn.multipleSelect.localLang || {};
    $.extend($.fn.multipleSelect.localLang, {
        formatAllSelected: function () { return 'همه موارد'; },
        formatSelectAll: function () { return 'انتخاب همه موارد'; },
        formatNoMatchesFound: function () { return 'هیچ موردی یافت نشد.'; }
    });
})(jQuery);