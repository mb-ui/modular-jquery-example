
import api from '../shared/index.js';
export default {
    getTreeData: () => api.getResources(['json/sampleTreeMenuData.json'])
};