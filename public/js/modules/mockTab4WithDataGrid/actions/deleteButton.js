import service from '../services.js';
export default function ({ e, rowData, $gridEl }) {
    alert(`action = del , rowId = ${rowData.id}`);
    service.delete(rowData.id);
};