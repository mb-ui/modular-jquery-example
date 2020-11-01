(function ($) {
    var dialogsEL = [];
    $.fn.extend({
        dialogAdapter: function () {
            var arg = arguments, argL = arg.length, that = this, getDefaultOptions = function () {
                return {
                    autoOpen: true,
                    height: 400,
                    width: 350
                };
            }, getPerviousDialog = function (el) {
                var result = '', _index = dialogsEL.indexOf(el), arr = dialogsEL.slice(_index - 1, _index);
                arr.length && (result = arr[0]);
                return result;
            }, getNextDialog = function (el) {
                var result = '', _index = dialogsEL.indexOf(el), arr = dialogsEL.slice(_index + 1, _index + 2);
                arr.length && (result = arr[0]);
                return result;
            };
            switch (argL) {
                case 0:
                    return this;
                case 1:
                    if (Object.prototype.toString.call(arg[0]).toUpperCase() === '[OBJECT OBJECT]') {
                        var options = arg[0], workingWithurl, ex = options.extendedSetting;
                        (ex && typeof ex === 'object' && ex.url) && (workingWithurl = true);
                        options.buttons = options.buttons || {};
                        if (typeof options.buttons !== 'object') { throw 'dialogAdapter "buttons" parameter must be type of object'; }
                        $.each(options.buttons, function (i, value) {
                            options.buttons[i] = function () { value({ $dialogEl: that }); };
                        });
                        var setting = $.extend(getDefaultOptions(), options, {
                            modal: true, dialogClass: 'dialogAdapter', open: function (event, ui) {
                                dialogsEL.push(that);
                                options.open && options.open(event, ui);
                                workingWithurl && that.next().hide();
                            }, beforeLoadTemplate: function () {
                                that.append('در حال بارگذاری...');
                                ex.beforeLoadTemplate && ex.beforeLoadTemplate({ $dialogEl: that });
                            }, afterLoadTemplate: function (temp) {
                                var ex = options.extendedSetting;
                                that.empty().append(temp);
                                ex.afterLoadTemplate && ex.afterLoadTemplate({ $dialogEl: that });
                                that.next().show();
                            }, close: function (event, ui) {
                                dialogsEL.splice(dialogsEL.indexOf(that), 1);
                                options.close && options.close(event, ui);
                                that.dialog("destroy").remove();
                            }
                        });
                        if (workingWithurl) {
                            setting.beforeLoadTemplate();
                            $.$getTemplate([ex.url]).then(setting.afterLoadTemplate);
                        }
                        $('body').append(this);
                        return this.dialog(setting);
                    }
                    else {
                        var methodName = arg[0].toUpperCase();
                        if (methodName === 'GETPERVIOUSDIALOG')
                            return getPerviousDialog(this);
                        if (methodName === 'GETNEXTDIALOG')
                            return getNextDialog(this);
                        return this.dialog(arg[0]);
                    }
                default:
                    return this.dialog.apply(this, arg);
            }
        },
    });
})(jQuery);