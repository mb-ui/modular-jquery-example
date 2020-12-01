export default function ({ $gridEl, accessor }) {
    $gridEl.jqGridAdapter('applyExternalSearch', { data: accessor.getValues(), operations: accessor.getOperations() });
};