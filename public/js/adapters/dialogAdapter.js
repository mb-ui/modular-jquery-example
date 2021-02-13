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
        _create: function () {
            var that = this, op = this.options;
            if (op.templateUrl) {
                that._trigger('beforeloadtemplate', null);
                $.ajax({
                    url: op.templateUrl,
                    type: 'get',
                    dataType: 'html'
                }).then(function (data) {
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