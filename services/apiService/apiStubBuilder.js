require('dotenv-extended').load();
const config = require("../../config/" + process.env.HOSTED_ENVIRONMENT + "_config.json");


const getEmployeeStubforHolidays = (sendMailTo) => {

    const requestOptionsforHolidays = {};
    requestOptionsforHolidays.requestBody = JSON.stringify({
        "tenantId": config.API.APICredentials.tenantID,
        "emailId": sendMailTo,
        "period": "FULL"
    });

    requestOptionsforHolidays.method = config.API.APIList.getHolidayList.Method;
    requestOptionsforHolidays.url = config.API.APIList.getHolidayList.Endpoint;
    requestOptionsforHolidays.header = {
        'Secret': config.API.APICredentials.Secret,
        'Content-Type': 'application/json'
    };
    return requestOptionsforHolidays;
};

module.exports = {
    getEmployeeStubforHolidays
   
};
