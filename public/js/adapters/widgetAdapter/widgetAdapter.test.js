(function (factory) { factory(window, document, window.QUnit, window.jQuery) })(function (w, d, q, $, undefined) {
    q.module("widgetAdapter : api ");
    q.test('create jQuery UI widget and extend $.fn', function (assert) {
        const pluginName = 'mockWidget', namespace = 'custom', prependPluginName = 'hidden_';
        $.fn.mockWidget = undefined;
        $[namespace][prependPluginName + pluginName] = undefined
        $.custom.widgetAdapter(namespace + '.' + pluginName, {});
        assert.ok(typeof $.fn.mockWidget === 'function', 'it must extend $.fn with pluginName');
        assert.ok(typeof $[namespace][prependPluginName + pluginName] === 'function'
            , 'it must call $.widget by prepending pluginName with "hidden_" => $.widget("sampleNamespace.hidden_samplePluginName",...)');

    });
    q.test('created jquery plugin instance must extend jquery ui widget built-in props by "_notFindMehtod" prop', function (assert) {
        assert.expect(2);
        const pluginName = 'mockWidget', namespace = 'custom', prependPluginName = 'hidden_', el = $('<div>');
        $.widget('custom.originalWidget', {});
        $.custom.widgetAdapter('custom.mockWidgetAdapter', {});
        const originalWidgetInstance = el.originalWidget().data('custom-originalWidget');
        const mockWidgetAdapterInstance = el.mockWidgetAdapter().data('custom-hidden_mockWidgetAdapter');
        let originalWidgetProps = [], mockWidgetAdapterProps = [];
        for (let prop in originalWidgetInstance)
            originalWidgetProps.push(prop);
        originalWidgetProps = originalWidgetProps.toString();
        for (let prop in mockWidgetAdapterInstance) {
            if (prop !== '_notFindMethod')
                mockWidgetAdapterProps.push(prop);
            else {
                assert.ok(true, 'widgetAdapter instance has "_notFindMethod" property additionally than jquery ui widget instance');
            }
        }
        mockWidgetAdapterProps = mockWidgetAdapterProps.toString();
        assert.ok(mockWidgetAdapterProps === originalWidgetProps, 'widgetAdapter instance has all properties of the jquery ui widget instance');
    });
    q.test('calling "_notFindMethod" prop on the instance', function (assert) {
        assert.expect(2);
        $.custom.widgetAdapter('custom.mockWidgetAdapter', {
            _notFindMethod: function (arrayOfParams) {
                assert.ok((arrayOfParams.constructor === Array && arrayOfParams[1] === 1000),
                    '"_notFindMethod" is called with an array of parameters');
                assert.ok(arrayOfParams[0] === 'undefinedMethod'
                    , 'calling "_notFindMethod" prop on the instance as a result of calling undefined prop on the instance');
            }
        });
        $('<div>').mockWidgetAdapter().mockWidgetAdapter('undefinedMethod', 1000);
    })
});