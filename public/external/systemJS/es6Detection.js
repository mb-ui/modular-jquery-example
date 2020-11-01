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
    $$.dynamicImport = function (modulePath) {
        return import('../../js/modules/' + modulePath);
    };
})();