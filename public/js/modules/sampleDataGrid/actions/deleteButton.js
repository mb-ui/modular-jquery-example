import service from '../services.js';
export default function (e, rowId) {
    const rowData = $(this).gridAdapter('getRowData', rowId);
    alert(`action = del , rowId = ${rowData.id}`);
    service.delete(rowData.id);
};