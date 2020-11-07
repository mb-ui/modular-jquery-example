var $$ = $$ || {};
if (!window.supportsDynamicImport) {
    $$.importModule = function (modulePath) { return System.import('./js/modules/' + modulePath); };
    var systemJsLoaderTag = document.createElement('script');
    systemJsLoaderTag.src = './external/systemJS/system.js';
    systemJsLoaderTag.addEventListener('load', function () {
        SystemJS.config({
            map: {
                'traceur': './external/systemJS/traceur/traceur.js'
            }
        });
    });
    if (typeof Promise === 'undefined') {
        var loadSystemJS = (function () {
            var i = -1;
            return function () {
                i++;
                if (!i) { return; }
                document.head.appendChild(systemJsLoaderTag);
            };
        })(), bluebird = document.createElement('script');
        bluebird.src = './external/systemJS/bluebird.core.min.js';
        bluebird.addEventListener('load', loadSystemJS);
        document.head.appendChild(bluebird);

        var fetchEl = document.createElement('script');
        fetchEl.src = './external/systemJS/fetch.umd.js';
        fetchEl.addEventListener('load', loadSystemJS);
        document.head.appendChild(fetchEl);
    } else {
        document.head.appendChild(systemJsLoaderTag);
    }
}