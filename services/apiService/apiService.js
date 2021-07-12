const axios = require('axios');
const https = require('https')

require('dotenv-extended').load();

const config = require(`../../config/${process.env.HOSTED_ENVIRONMENT}_config.json`);

//const { APICallLogger } = require('../logService/loggerService');

const { genericFunctions } = require('../../Utilities');

//IF SSL is not present use this agent
const agent = new https.Agent({
    rejectUnauthorized: true
});

/*
For General API's
*/
const CallApi = async (requestOptions, sendMailTo) => {
    // console.log("API request options===>", requestOptions)
    let result = null;
    try {
        result = await axios({
            method: requestOptions.method,
            url: requestOptions.url,
            headers: requestOptions.header,
            data: requestOptions.requestBody,
            //httpsAgent: agent        //TO disable SSL
        });
        result.status = true;
        /* if (context.activity.channelId === 'msteams') {
            APICallLogger(context, userDetails, requestOptions, 'Success', result.data, null);
        } */

    } catch (error) {
        console.log("===>", error.response.data)
        result = error.response.data;
        result.status = false;
        /* if (context.activity.channelId === 'msteams') {
            APICallLogger(context, userDetails, requestOptions, 'Failed', null, error);
            //await genericFunctions.sendEmail(send_Mails_To, "API Error in BOT", error); //TODO send mail to admin of the bot
        } */
    }

    // Dev logs
    // console.log('API Result', result.data ? result.data : result);
    return result;
};
module.exports = {
    CallApi
}