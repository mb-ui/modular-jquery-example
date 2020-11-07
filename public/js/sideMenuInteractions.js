(function () {
    var body, bodyWidth, bodyHeight, container, verticalTabList, sideMenuResizer, verticalTabListWidth, verticalPanelList, horizentalMenuContainer
        , verticalPanelTemplate = '<div class="verticalPanel">loading...</div>';
    function open(el) {
        var src = el.attr('src');
        if (verticalPanelList.children().first().attr('tabSrc') !== src) {
            verticalPanelList.empty().append('<p>loading ....</p>');
            $$.importModule(src).then(function (result) {
                var panelEl = $(verticalPanelTemplate);
                result.default({ panelElement: panelEl });
                verticalPanelList.empty().append(panelEl);
            });
        }
        container.removeClass("hiddenVerticalPanelList");
    }
    function close() { container.addClass("hiddenVerticalPanelList"); }
    function toggleOpen(el) {
        if (el.hasClass('ui-state-highlight')) {
            el.removeClass('ui-state-highlight');
            close();
        } else {
            $('#verticalTabList .ui-state-highlight').removeClass('ui-state-highlight');
            open(el.addClass('ui-state-highlight'));
        }
    }
    $(window).resize(function () {
        body = body || $('body');
        bodyWidth = bodyWidth || body.width();
        bodyHeight = bodyHeight || body.height();
    });
    function sideMenuTriggerClick($el) {
        $el.hasClass('sideMenuIcon') ? toggleOpen($el) :
            ($el.hasClass('ui-icon') && toggleOpen($el.closest('.sideMenuIcon')));
    }
    addEventListener('DOMContentLoaded', function (e) {
        verticalPanelList = verticalPanelList || $('#verticalPanelList');
        container = container || $('#container');
        horizentalMenuContainer = horizentalMenuContainer || $('#horizentalMenuContainer');
        verticalTabList = verticalTabList || $('#verticalTabList');
        verticalTabListWidth = verticalTabListWidth || verticalTabList.width();
        sideMenuResizer = sideMenuResizer || $('#sideMenuResizer');
        body = body || $('body');
        bodyWidth = bodyWidth || body.width();
        bodyHeight = bodyHeight || body.height();
        verticalTabList.click(function (e) {
            sideMenuTriggerClick($(e.target));
        });
        sideMenuResizer.draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            containment: '#resizerContainer',
            cursor: 'ew-resize',
            start: function (event, ui) {
            }
        });
        horizentalMenuContainer.add(verticalPanelList).droppable({
            accept: ".sideMenuResizer",
            cursor: 'ew-resize',
            classes: {
                "ui-droppable-active": "loading"
            },
            drop: function (event, ui) {
                var verticalPanelListWidth = bodyWidth - verticalTabListWidth - ui.position.left;
                if (verticalPanelListWidth <= 50) {
                    $('.sideMenuIcon.ui-state-highlight').click();
                    return;
                }
                verticalPanelList.css({
                    width: verticalPanelListWidth + 'px'
                });
                horizentalMenuContainer.css({
                    right: verticalPanelListWidth + 4 + verticalTabListWidth + 'px'
                });
                sideMenuResizer.css({
                    right: verticalTabListWidth + verticalPanelListWidth + 'px'
                });
            }
        });
        sideMenuTriggerClick(verticalTabList.children().first());
    });
})();
