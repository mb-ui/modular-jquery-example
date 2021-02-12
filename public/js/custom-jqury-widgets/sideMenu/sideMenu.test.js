(function (factory) { factory(window, document, window.QUnit, window.jQuery) })(function (w, d, q, $, undefined) {
    q.module("jqSideMenu : markup structure ");
    q.test('base', function (assert) {
        var $containerEl = $('<div>'), data = [{ id: 'tab1', text: 'tab1' }, { id: 'tab2', text: 'tab2' }];
        $containerEl.jqSideMenu({});
        var panelList = $containerEl.children('div.sideMenu-panelList'), tabList = $containerEl.children('ul.sideMenu-tabList');
        assert.ok($containerEl.children('div.sideMenu-resizerContainer').length, 'it must create div.sideMenu-resizerContainer inside the element');
        assert.ok($containerEl.children('div.sideMenu-resizer').length, 'it must create div.sideMenu-resizer inside the element');
        assert.ok(panelList.length, 'it must create div.sideMenu-panelList inside the element');
        assert.ok(tabList.length, 'it must create ul.sideMenu-tabList inside the element');
        $containerEl.jqSideMenu('openTabs', data);
        var tabs = tabList.children('li.sideMenu-tab'), panels = panelList.children('div.sideMenu-panel');
        assert.strictEqual(tabs.length, 2, 'tab structure must be li.sideMenu-tab');
        assert.strictEqual(panels.length, 2, 'panel structure must be div.sideMenu-panel');
        for (var i = 0, l = data.length; i < l; i++) {
            assert.ok(tabList.children('[tab-id="' + data[i].id + '"]').length === 1, 'each tab have a tab-id attribute');
            assert.ok(panelList.children('[tab-id="' + data[i].id + '"]').length === 1, 'each panel have a tab-id attribute');
        }
        assert.ok(panelList.children('.sideMenu-panel-alreadyLoaded').length === 0, 'at the beginning, before selecting tabs, there is not any tab with "sideMenu-panel-alreadyLoaded" className');
    });
    q.module("jqSideMenu : evnets ");
    (function (factory) {
        var getData = () => [{ id: 'tab1', text: 'tab1' }, { id: 'tab2', text: 'tab2' }],
            getEl = () => $('<div>'),
            deselectTabKeys = 'isOpen,tabListWidth,panelListWidth,$tabListEl,$panelListEl,$resizerContainerEl,$resizerEl,$panelEl,$tabEl',
            clickTabKeys = 'isOpen,tabListWidth,panelListWidth,$tabListEl,$panelListEl,$resizerContainerEl,$resizerEl',
            selectTabKeys = 'isOpen,tabListWidth,panelListWidth,$tabListEl,$panelListEl,$resizerContainerEl,$resizerEl,$panelEl,$tabEl',
            firstselecttabKeys = 'isOpen,tabListWidth,panelListWidth,$tabListEl,$panelListEl,$resizerContainerEl,$resizerEl,$panelEl,$tabEl';
        factory(getData, getEl, selectTabKeys, deselectTabKeys, clickTabKeys, firstselecttabKeys);
    })(function (_getData, _getEl, _selectTabKeys, _deselectTabKeys, _clickTabKeys, _firstselecttabKeys) {
        q.test('selecttab', function (assert) {
            assert.expect(4); var el = _getEl();
            el.jqSideMenu({
                selecttab: function (e, obj) {
                    assert.strictEqual(Object.keys(obj).toString(), _selectTabKeys, 'selecttab callback parameters are "event, {' + _selectTabKeys + '}"');
                }
            }).on('jqsidemenuselecttab', function (e, obj) {
                assert.strictEqual(Object.keys(obj).toString(), _selectTabKeys, 'selecttab triggered event parameters are "event, {' + _selectTabKeys + '}"');
                assert.ok($('ul.sideMenu-tabList>[tab-id="tab1"]', el).hasClass('sideMenu-selected'), 'selected tab proper className');
                assert.ok($('div.sideMenu-panelList>[tab-id="tab1"]', el).hasClass('sideMenu-selected'), 'selected panel proper className');
            }).jqSideMenu('openTabs', _getData()).jqSideMenu('selectTab', 'tab1');
        });
        q.test('deselecttab', function (assert) {
            assert.expect(4); var el = _getEl();
            el.jqSideMenu({
                deselecttab: function (e, obj) {
                    assert.strictEqual(Object.keys(obj).toString(), _deselectTabKeys, 'selecttab callback parameters are "event, {' + _deselectTabKeys + '}"');
                }
            }).on('jqsidemenudeselecttab', function (e, obj) {
                assert.strictEqual(Object.keys(obj).toString(), _deselectTabKeys, 'selecttab triggered event parameters are "event, {' + _deselectTabKeys + '}"');
                assert.ok(!$('ul.sideMenu-tabList>[tab-id="tab1"]', el).hasClass('sideMenu-selected'), 'deselected tab proper className');
                assert.ok(!$('div.sideMenu-panelList>[tab-id="tab1"]', el).hasClass('sideMenu-selected'), 'deselected panel proper className');
            }).jqSideMenu('openTabs', _getData()).jqSideMenu('selectTab', 'tab1').jqSideMenu('deselectTab', 'tab1');
        });
        q.test('firstselecttab', function (assert) {
            assert.expect(3); var el = _getEl();
            el.jqSideMenu({
                firstselecttab: function (e, obj) {
                    assert.strictEqual(Object.keys(obj).toString(), _firstselecttabKeys, 'selecttab callback parameters are "event, {' + _firstselecttabKeys + '}"');
                }
            }).on('jqsidemenufirstselecttab', function (e, obj) {
                assert.strictEqual(Object.keys(obj).toString(), _firstselecttabKeys, 'firstselecttab triggerd event parameters are "event, {' + _firstselecttabKeys + '}"');
                assert.ok(1, 'firstselecttab handler is executed at most once per tab, after first selection of the tab');
            }).jqSideMenu('openTabs', _getData()).jqSideMenu('selectTab', 'tab1').jqSideMenu('deselectTab', 'tab1').jqSideMenu('selectTab', 'tab1');
        });
        q.test('clicktab', function (assert) {
            assert.expect(25); var el = _getEl();
            el.jqSideMenu({
                deselecttab: function () { assert.step("execute deselectTab after selecting a tab when we have already a selected tab"); },
                selecttab: function () { assert.step("execute selectTab after selecting tab"); },
                firstselecttab: function () { assert.step("execute firstselectTab after the first time of selecting a specific tab"); },
                onclose: function () { assert.step("execute onclose after selecting a selected tab"); },
                onopen: function () { assert.step('execute onopen after selecting tab when sideMenu state is close'); },
                clicktab: function (e, obj) {
                    assert.strictEqual(Object.keys(obj).toString(), _clickTabKeys, 'clicktab callback parameters are "event, {' + _clickTabKeys + '}"');
                }
            }).on('jqsidemenuclicktab', function (e, obj) {
                assert.strictEqual(Object.keys(obj).toString(), _clickTabKeys, 'clicktab triggered event parameters are "event, {' + _clickTabKeys + '}"');
            });
            el.jqSideMenu('openTabs', _getData());
            var _instance = el.jqSideMenu('instance'), $tab2El = $('li[tab-id="tab2"]', el), $tab1El = $('li[tab-id="tab1"]', el);
            $tab1El.trigger('click');
            assert.ok(_instance.isOpen, 'sideMenu state is open initially');
            assert.verifySteps(["execute firstselectTab after the first time of selecting a specific tab",
                "execute selectTab after selecting tab"], "first is executed firstselectTab and then is executed selectTab");
            $tab2El.trigger('click');
            assert.ok(_instance.isOpen, 'sideMenu state is still open, after selecting another tab');
            assert.verifySteps(["execute deselectTab after selecting a tab when we have already a selected tab",
                "execute firstselectTab after the first time of selecting a specific tab",
                "execute selectTab after selecting tab"],
                "first is executed deselectTab and then is executed selectTab");
            $tab2El.trigger('click');
            assert.ok(!_instance.isOpen, 'sideMenu state is close, after selecting a selected tab');
            assert.verifySteps(["execute deselectTab after selecting a tab when we have already a selected tab",
                "execute onclose after selecting a selected tab"], "first is executed deselectTab and then is executed onclose");
            $tab1El.trigger('click');
            assert.ok(_instance.isOpen, 'sideMenu state is open, after selecting a tab which was not selected perviously');
            assert.verifySteps(["execute selectTab after selecting tab", "execute onopen after selecting tab when sideMenu state is close"]
                , "first is executed selectTab and then is executed onOpen");
        });
    });
});
