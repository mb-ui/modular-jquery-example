(function () {
    import('./modules/mockModule.js');
    const arrowFunctionDetection = (param = {}) => {
        let destructuringDetection = { a: 2 };
        const { a } = destructuringDetection;
        destructuringDetection = { ...destructuringDetection };
        return a;
    };
    let result = arrowFunctionDetection();
    $$.supportNativeModule = true;
    $$.importModule = function (modulePath) {
        return import('./modules/' + modulePath);
    };
})();