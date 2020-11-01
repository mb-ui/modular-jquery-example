import accessor from './accessor.js'
export default function ({ e, $gridEl }) {
    $('<div>').dialogAdapter({
        extendedSetting: {
            url: 'js/modules/user/createDialog/index.html',
            afterLoadTemplate: function ({ $dialogEl }) {
                accessor.init($dialogEl);
            }
            , beforeLoadTemplate: function (param) { }
        },
        title: 'کاربر جدید',
        height: 700,
        width: 850,
        buttons: {
            'تایید': function () {
                var data = accessor.getValues();
                debugger;
                // sending data to server
            }
        }
    });
};