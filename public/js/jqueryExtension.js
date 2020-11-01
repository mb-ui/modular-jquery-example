(function ($) {
    $.extend({
        $getTemplate: function (url) {
            url.constructor === Array || (url = [url]);
            for (var i = 0, l = url.length; i < l; i++) {
                url[i] = $.ajax({
                    url: url[i],
                    type: 'get',
                    dataType: 'html'
                });
            }
            return $.when.apply(undefined, url).then(function () {
                var arr = [];
                if (arguments[0].constructor !== Array)
                    arr.push(arguments[0]);
                else
                    for (var i = 0, arg = arguments, l = arg.length; i < l; i++)
                        arr.push(arg[i][0]);
                return arr;
            }).catch(function (er) { throw new Error(er.message); });
        }
    });
    $.fn.extend({
        $toggleTopSearchPanel: function () {
            if (this.hasClass('ui-icon-circle-triangle-n')) {
                this.addClass('ui-icon-circle-triangle-s').removeClass('ui-icon-circle-triangle-n');
                this.parent().parent().addClass('expand');
            } else {
                this.addClass('ui-icon-circle-triangle-n').removeClass('ui-icon-circle-triangle-s');
                this.parent().parent().removeClass('expand');
            }
            return this;
        },
        findByCode: function (codeName) { return this.find('[code="' + codeName + '"]').first(); }
    });
})(jQuery);
