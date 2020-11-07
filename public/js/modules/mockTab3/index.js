import api from '../shared/api/index.js';
export default function ({ panelElement: pEl, tabObjs, containerID }) {
    api.getResources(['js/modules/mockTab3/index.html']).then(([temp]) => {
        pEl.append(temp);
    });
};