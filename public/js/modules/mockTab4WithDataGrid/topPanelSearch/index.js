export default function ({ $gridEl, accessor }) {
    $gridEl.jqGridAdapter('applySearch', { data: accessor.getValues(), operations: accessor.getOperations()});
};