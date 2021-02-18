export default function (e, rowId) {
    const rowData = $(this).gridAdapter('getRowData', rowId);
    alert(`action = update , rowId = ${rowData.id}`);
};