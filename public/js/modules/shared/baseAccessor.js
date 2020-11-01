class BaseAccessor {
    constructor(elements) {
        elements.reduce((acc, item) => {
            acc[item] = $$(`#${item}`);
            return acc;
        }, this);
    }
}
export default BaseAccessor;