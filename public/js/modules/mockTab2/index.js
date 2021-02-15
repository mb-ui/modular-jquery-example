import api from '../shared/index.js';
export default function ({ panelElement: pEl, containerID }) {
    api.getResources(['js/modules/mockTab2/index.html']).then(([temp]) => {
        pEl.append(temp);
    });
};