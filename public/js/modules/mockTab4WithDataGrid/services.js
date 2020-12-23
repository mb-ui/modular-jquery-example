var date = new Date(2019, 1, 1)
    , client = ['client 1', 'client 2', 'client 3', 'client 2', 'client 3', 'client 3', 'client 2', 'client 1', 'client 3', 'client 1']
    , notes = ['note 1', 'note 2', 'note 3', 'note 2', 'note 3', 'note 3', 'note 2', 'note 1', 'note 3', 'note 1'];
export default {
    getLocalDataGrid: function () {
        var _data = [];
        for (var i = 0; i < 50; i++) {
            var r1 = Math.floor(Math.random() * 10), r2 = Math.floor(Math.random() * 10), m = r1 + 1, d = r2 + 1
                , mStr = m == 10 ? '10' : `0${m}`
                , dStr = d == 10 ? '10' : `0${d}`;
            var obj = {
                id: i,
                day: date.setMonth(m - 1, d),
                dayString: `${mStr}/${dStr}/2019`,
                client: client[r2],
                amount: r1 * 100,
                tax: r2 * 100,
                notes: notes[r1]
            };
            obj.total = obj.amount + obj.tax;
            _data.push(obj);
        }
        return _data;
    },
    getClientData: () => Promise.resolve((function () {
        const data = [], uniqueClient = [];
        client.map((value) => {
            if (uniqueClient.indexOf(value) === -1) {
                uniqueClient.push(value);
                data.push({ text: value, value });
            }
        });
        return data;
    })()),
    getNotesData: () => Promise.resolve((function () {
        const data = [], uniqueNotes = [];
        notes.map((value) => {
            if (uniqueNotes.indexOf(value) === -1) {
                uniqueNotes.push(value);
                data.push({ text: value, value });
            }
        });
        return data;
    })()),
    create: data => {
        //send data to the server.
    }
};