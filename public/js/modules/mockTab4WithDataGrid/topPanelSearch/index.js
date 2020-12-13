export default function ({ $gridEl, accessor }) {
    $gridEl.gridAdapter('applyExternalSearch', { data: accessor.getValues(), operations: accessor.getOperations() });
};