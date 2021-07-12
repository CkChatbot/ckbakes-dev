/**
 * Logger module.
 * @module Logger
 */
require('dotenv-extended').load();

// Import required services for bot telemetry
const { ApplicationInsightsTelemetryClient } = require('botbuilder-applicationinsights');

const dateTime = require('node-datetime');
const config = require('../../config/' + process.env.HOSTED_ENVIRONMENT + '_config.json');
const INSTRUMENT_KEY = config.AzureServices.AppInsights.INSTRUMENT_KEY;

/* Utility functions */
const getDateString = () => {
    const currentDate = dateTime.create();
    return currentDate.format('d-f-Y');
};

const getTimeString = () => {
    // Assuming the Host of this app is having UTC time
    const d = new Date();
    // console.log('LoggerTime + 0530', (new Date(d.getTime() + ( 5.5 * 60 * 60 * 1000 ))).toLocaleTimeString());
    return (new Date(d.getTime() + (5.5 * 60 * 60 * 1000))).toLocaleTimeString();
};

/**
 * For all logger ConversationID, Encrypted UserName, and Encrypted UserID variable are needed
 *
 * @param  {userDetails} userDetails user information
 * @returns {userData} userData containing Encrypted information
 */
const getUserData = (userDetails) => {
    const userData = {
        userId_Enc: '',
        userName_Enc: '',
        formattedCurrentDate: '',
        formattedCurrentTime: ''
    };

    userData.formattedCurrentDate = getDateString();
    userData.formattedCurrentTime = getTimeString();

    return userData;
};

const getTelemetryClient = () => {
    return new ApplicationInsightsTelemetryClient(INSTRUMENT_KEY);
};
/**
 * This function logs All API call Logs info to AppInsights
 * @param  {TurnContext} context
 * @param  {UserProfileData} userProfileData user information
 */

/* const APICallLogger = (context, userProfileData, requestOption, apiStatus, apiResult, errorMessage = '') => {
    let logClient = getTelemetryClient();

    let ConversationId = context.activity.conversation.id;
    let UserName = context.activity.from.name;
    let EmployeeID = userProfileData.EmployeeID;
    let UserInput = context.activity.text;
    // Encryption not required here // Requested by TechM team
    let { formattedCurrentDate, formattedCurrentTime } = getUserData(userProfileData);


    // Logs to appInsights
    logClient.trackEvent({
        name: "API_Logs",
        properties: {
            ConversationId,
            UserName,
            EmployeeID,
            UserInput,
            requestOption,
            apiStatus,
            apiResult,
            errorMessage,
            Date: formattedCurrentDate,
            Time: formattedCurrentTime
        }
    });
    logClient = null;
}; */

/**
 * Logs every incoming activity
 * @param  {TurnContext} context
 * @param  {UserProfileData} userProfileData user information
 */

const logIncomingActivity = (context, userProfileData) => {

    let logClient = getTelemetryClient();

    let ConversationId = context.activity.conversation.id;
    let UserName = context.activity.from.name;
    let EmployeeID = userProfileData.EmployeeID;
    let UserMessage = context.activity.text;

    // Encryption not required here // Requested by TechM team
    let { formattedCurrentDate, formattedCurrentTime } = getUserData(userProfileData);

    // Logs to appInsights
    logClient.trackEvent({
        name: "User_Response",
        properties: {
            ConversationId,
            UserName,
            EmployeeID,
            UserMessage,
            Date: formattedCurrentDate,
            Time: formattedCurrentTime
        }
    });
    logClient = null;
};

/**
 * Logs every outgoing activity
 * @param  {TurnContext} context
 * @param  {UserProfileData} userProfileData user information
 * @param  {string} botReply message from bot 
 */
const logOutgoingActivity = (context, userProfileData, activity, botReply) => {

    let logClient = getTelemetryClient();

    let ConversationId = activity.conversation.id;
    let UserName = activity.recipient.name;
    let BotResponse = botReply;
    let UserMessage = context.activity.text;

    // Encryption not required here // Requested by TechM team
    let { formattedCurrentDate, formattedCurrentTime } = getUserData(userProfileData);

    // Logs to appInsights
    logClient.trackEvent({
        name: "Bot_Response",
        properties: {
            ConversationId,
            UserName,
            BotResponse,
            UserMessage,
            
            Date: formattedCurrentDate,
            Time: formattedCurrentTime
        }
    });
    logClient = null;
};

/**
 * This function logs All Error Logs info to AppInsights
 * ERROR 
 * Middleware.ErrorLogger (Older Version)
 * @param  {TurnContext} context
 * @param  {UserProfileData} userProfileData user information
 */

const errorLogger = (context, userProfileData, errorStack) => {
    let logClient = getTelemetryClient();

    let ConversationId = context.activity.conversation.id;
    let UserName = context.activity.from.name;
    let EmployeeID = userProfileData.EmployeeID;
    let UserInput = context.activity.text;

    // Encryption not required here // Requested by TechM team
    let { formattedCurrentDate, formattedCurrentTime } = getUserData(userProfileData);

    // Logs to appInsights
    logClient.trackEvent({
        name: "Error_Logs",
        properties: {
            ConversationId,
            UserName,
            EmployeeID,
            UserInput,
            Error: errorStack,
            Date: formattedCurrentDate,
            Time: formattedCurrentTime
        }
    });
    logClient = null;
};

/**
 * This function logs QnA info to AppInsights
 * @param  {UserProfileData} userProfileData user information
 * @param  {QnaData} qnaData
 * @param  {TurnContext} context
 */
//TODO implement this in QNA.js
/* const logQnAToDB = (context, userProfileData, qnaData) => {
    let logClient = getTelemetryClient();

    let convoId = context.activity.conversation.id;
    let UserName = context.activity.from.name;
    let EmployeeID = userProfileData.EmployeeID;
    let { formattedCurrentDate, formattedCurrentTime } = getUserData(userProfileData);

    let question = qnaData.lastQ;
    let answer = qnaData.lastA;

    // Logs to appInsights
    logClient.trackEvent({
        name: "QnA_Log",
        properties: {
            UserID: EmployeeID,
            UserName: UserName,
            ConversationID: convoId,
            Question: question,
            Answer: answer,
            DATE: formattedCurrentDate,
            TIME: formattedCurrentTime
        }
    });
    logClient = null;
};
 */
/**
 * This function logs failed utternaces info to appInsights
 * @param  {userProfileData } userProfileData user information
 * @param  {TurnContext} context
 */
/* const NLPLogger = (context, userProfileData, nlpResult) => {
    const logClient = getTelemetryClient();

    let convoId = context.activity.conversation.id;
    let FailedUtterance = context.activity.text;
    let { formattedCurrentDate, formattedCurrentTime } = getUserData(userProfileData);

    // Logs to appInsights
    logClient.trackEvent({
        name: "NLP_Logs",
        properties: {
            UserID: userProfileData.EmployeeID,
            UserName: context.activity.from.name,
            ConversationID: convoId,
            FailedUtterance,
            NLPResult: nlpResult,
            DATE: formattedCurrentDate,
            TIME: formattedCurrentTime
        }
    });
}; */

// Exports module functionality
module.exports = {
    //logQnAToDB,
    logIncomingActivity,
    logOutgoingActivity,
    errorLogger,
    //APICallLogger,
    //NLPLogger
};