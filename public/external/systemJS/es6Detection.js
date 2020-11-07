var $$ = $$ || {};
(function () {
    import('./mockModule.js');
    const arrowFunctionDetection = (param = {}) => {
        let destructuringDetection = { a: 2 };
        const { a } = destructuringDetection;
        destructuringDetection = { ...destructuringDetection };
        return a;
    };
    let result = arrowFunctionDetection();
    window.supportsDynamicImport = true;
    $$.importModule = function (modulePath) {
        return import('../../js/modules/' + modulePath);
    };
})();