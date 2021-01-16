import api from '../shared/index.js';
export default {
    getTreeData: () => api.getResources(['json/sampleTreeMenuData.json']).then(([arr]) => {
        const result = [], data = arr.data;
        for (let i = 0, l = data.length; i < l; i++) {
            const { id, parent, text, type, jsModulePath, tooltip } = data[i];
            result.push({ id, parent, text, customType: type, extraData: { jsModulePath, tooltip } });
        }
        return result;
    })
};