$(document).ready(function () {
    $(this).click(function (e) {
        var el = e.target, cssClass = el.className;
        if (cssClass.includes('toggleTopSearchPanel'))
            $(el).$toggleTopSearchPanel();
    });
    (function () {
        var linkEl = $('#1ACC78AA-7D66-4877-B797-2298E5E88295'),body=$('body');
        localStorage.userTeme = localStorage.userTeme || 'cupertino';
        linkEl.attr('href', linkEl.attr('href').replace('cupertino', localStorage.userTeme));
        body.addClass(localStorage.userTeme);
    })();
});