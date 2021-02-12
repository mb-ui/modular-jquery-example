(function (factory) {
    var commonProps = {
        _notFindMethod: function (arrayOfParameters) { }
    };
    factory(window, document, window.jQuery, 'hidden_', commonProps);
})(function (w, d, $, _prependWidgetName, _commonProps, undefined) {
    $.custom = $.custom || {};

    //$.custom.widgetAdapter( name [, base ], propsObject)
    //$.custom.widgetAdapter extends $.widget by adding "_notFindMethod" method to it, which it's a built-in mehtod in $.custom.widgetAdapter 
    //_notFindMethod is called whenever a requested public method not find in the instance of $.widget.
    //You can override any jquery ui widget by using $.widget, but $.custom.widgetAdapter is useful for overriding any jquery plugin.
    //you should implement "_notFindMethod" prop like this => _notFindMethod : function(arrayOfParameters){do sth here}
    //for more information about the parameters, built-in methods and options refer to jQuery UI widget factory documentation.
    $.custom.widgetAdapter = function (name) {
        var widgetArgs = $.makeArray(arguments), nameArr = name.split('.'), lastParamIndex = widgetArgs.length - 1,
            namespace = nameArr[0], pluginName = nameArr[1];
        widgetArgs[lastParamIndex] = $.extend({}, _commonProps, widgetArgs[lastParamIndex]);

        // check if jQuery UI widget does not exist. then construct widget.
        if (!$[namespace] || !$[namespace][pluginName]) {
            var widgetParams = widgetArgs.slice();
            // prepend name of the widget
            widgetParams[0] = namespace + '.' + _prependWidgetName + pluginName;
            $.widget.apply($, widgetParams);
        }
        // create jquery plugin
        $.fn[pluginName] = function (options) {
            var pluginArgs = $.makeArray(arguments), after = pluginArgs.slice(1), publicMehtodResult;
            this.each(function () {
                var el = $(this), instance = el.data(namespace + '-' + _prependWidgetName + pluginName);

                // check whether the plugin has already been initialized on the element
                if (!instance) {
                    //create instance and initialize on the element
                    el[_prependWidgetName + pluginName](options);
                } else {
                    // otherwise check whether a “public” function is called
                    if (typeof options === 'string' && options[0] !== '_') {
                        //check if instance contains the method
                        if (typeof instance[options] === 'function') {
                            var value = instance[options].apply(instance, after);
                            // check if the value is not a jquery instance and is not chainable then break the .each() and return the value
                            if (value !== undefined && !(value instanceof jQuery)) {
                                publicMehtodResult = value;
                                return false; // break .each()
                            }
                        } else {
                            // call "_notFindMethod" method on the instance
                            var value = instance._notFindMethod(pluginArgs);
                            // check if the value is not a jquery instance and is not chainable then break the .each() and return the value
                            if (value !== undefined && !(value instanceof jQuery)) {
                                publicMehtodResult = value;
                                return false; // break .each()
                            }
                        }
                    }
                }
            });
            return publicMehtodResult === undefined ? this : publicMehtodResult;
        };
        return $;
    };
});