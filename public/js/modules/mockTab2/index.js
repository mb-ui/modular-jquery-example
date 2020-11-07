import api from '../shared/api/index.js';
export default function ({ panelElement: pEl, tabObjs, containerID }) {
    api.getResources(['js/modules/mockTab2/index.html']).then(([temp]) => {
        pEl.append(temp);
    });
};