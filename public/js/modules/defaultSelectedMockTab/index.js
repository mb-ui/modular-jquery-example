import api from '../shared/index.js';
export default function ({ panelElement: pEl, tabObjs, containerID }) {
    api.getResources(['js/modules/defaultSelectedMockTab/index.html']).then(([temp]) => {
        pEl.append(temp);
    });
};