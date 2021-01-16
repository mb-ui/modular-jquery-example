export default {
    key: 'treeMenuSelected',
    save: function (selectedArr) {
        localStorage[this.key] = selectedArr.toString();
    },
    load: function () {
        return (localStorage[this.key] || '').split(',');
    },
    clear: function () {
        localStorage.removeItem(this.key);
    }
};