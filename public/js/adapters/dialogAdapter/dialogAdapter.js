(function ($) {
    $.widget('custom.dialogAdapter', $.ui.dialog, {
        options: {
            autoOpen: true,
            height: 400,
            width: '90%',
            modal: true,
            dialogClass: 'dialogAdapter',
            templateUrl: ''// additional option
        },
        _loadTemplate: function (url) {
            return $.ajax({
                url: url,
                type: 'get',
                dataType: 'html'
            });
        },
        _create: function () {
            var that = this, op = this.options;
            if (op.templateUrl) {
                this._trigger('beforeloadtemplate', null);
                this._loadTemplate(op.templateUrl).then(function (data) {
                    that._trigger('afterloadtemplate', null, { data: data });
                });
            }
            return this._super();
        },
        close: function () {
            return this.destroy();// destroy instead of hiding the dialog element
        }
    });
})(jQuery);