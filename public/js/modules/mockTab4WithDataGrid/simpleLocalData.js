export default function () {
    var data = [];
    //var colModel = {
    //    userId: '',
    //    fullName: ['علی شعبانی', ' علی قربانی', 'محسن شعبانی', 'محسن قربانی', 'عبدالله قربانی', 'سعید سعیدی', 'علی سعیدی', 'پوریا اکبر', 'اکبر سعیدی'],
    //    fatherName: ['علی', 'حمید', 'محسن', 'عبدالله', 'سعید'],

    //    nationalCode: ['0012238597', '0022538597', '0013538597', '0012538517', '0012538587'],
    //    postalCode: ['1234567829', '1234567839', '1234567849', '1234567859', '1234567869', '1234567879', '1234567889'],

    //    sexTitle: ['مرد', 'زن'],
    //    sexCode: [1, 2],
    //    isActive: [true, false],

    //    statusTitle: ['تایید شده', 'تایید نشده', 'در انتظار تایید', 'نامشخص'],
    //    statusCode: [1, 2, 3, 4],
    //    roleTitle: ['کاربر شعبه', 'کاربر اینترنتی'],
    //    roleCode: [1, 2],

    //    birthDateString: ['',''],
    //    birthDate: ['', '']
    //};
    //var jsonData = JSON.stringify(data);

    for (var i = 0; i < 5000; i++)
        data.push({
            id: i + 1,
            Country: `country${i}`,
            Capital: `capital${i}`,
            Date: `date${i}`,
            code: `code${i}`
        });

    return data;
};