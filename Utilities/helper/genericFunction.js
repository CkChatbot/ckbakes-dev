const nodemailer = require("nodemailer");
var moment = require('moment')

const config = require("../../config/" + process.env.HOSTED_ENVIRONMENT + "_config.json");

const axios = require('axios');
const queryString = require('querystring');

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


/* 
    Send ProActive Message to user
*/
// to use incase of context
const sendTeamsMessage = async (message, conversationReference, context) => {
    const adapter = context.adapter;

    await adapter.continueConversation(conversationReference, async turnContext => {
        await turnContext.sendActivity(message);
    });
};

// to use incase of cron
const sendTeamsMessageCron = async (message, conversationReference,adapter) => {
    

    await adapter.continueConversation(conversationReference, async turnContext => {
        await turnContext.sendActivity(message);
    });
};

const getTimeString = async (time) => {
    // currentDate = dateTime.create();
    // return currentDate.format('H:M:S');
 
    // Assuming the Host of this app is having UTC time
    let d = new Date(time);
    // console.log('LoggerTime + 0530', (new Date(d.getTime() + ( 5.5 * 60 * 60 * 1000 ))).toLocaleTimeString());
    return (new Date(d.getTime() + ( 5.5 * 60 * 60 * 1000 ))).toLocaleTimeString();
};

const calculateInTime = async (result) =>{
    console.log('calculateInTime');
    console.log(result);
    let sum = moment('00:00:00',"HH:mm:ss");
    for (let i = 0; i < result.length; i++) {
        let outTime = result[i].Time_stamp;
        console.log(endTime);
        let punchType = result[i].Punch_type;
        if(punchType == 'OUT'){
            let inTime = result[i-1].Time_stamp;

            var startTime = moment(inTime, "HH:mm:ss ");
            var endTime = moment(outTime, "HH:mm:ss ");

            var hrs = moment.utc(endTime.diff(startTime)).format("HH");
            var min = moment.utc(endTime.diff(startTime)).format("mm");
            var sec = moment.utc(endTime.diff(startTime)).format("ss");
            console.log([hrs, min, sec].join(':'));
            let difference = [hrs, min, sec].join(':')


            sum = moment(sum, 'hh:mm:ss').add(difference)
                        
            

            
            console.log('sum',sum);
            




            
        }
        
    }
    console.log(`Total IN hrs:'${sum.format('HH')} : ${sum.format('mm')} : ${sum.format('ss')}`);
    return sum;


}

const calculateOutTime = async (result) =>{
    console.log('calculateOutTime');
    //console.log(result);
    let sum = moment('00:00:00',"HH:mm:ss");
    for (let i = 2; i < result.length; i++) {
        
        //console.log(endTime);
        let punchType = result[i].Punch_type;
        if(punchType == 'IN'){
            
            let inTime = result[i].Time_stamp;
            let outTime = result[i-1].Time_stamp;
            
            

            var startTime = moment(inTime, "HH:mm:ss ");
            var endTime = moment(outTime, "HH:mm:ss ");

            var hrs = moment.utc(startTime.diff(endTime)).format("HH");
            var min = moment.utc(startTime.diff(endTime)).format("mm");
            var sec = moment.utc(startTime.diff(endTime)).format("ss");
            console.log([hrs, min, sec].join(':'));
            let difference = [hrs, min, sec].join(':')


            sum = moment(sum, 'hh:mm:ss').add(difference)
            

            
            




            
        }
        
    }
    console.log(`Total out hrs:'${sum.format('HH')} : ${sum.format('mm')} : ${sum.format('ss')}`);
    return sum;
        

    
    

}








module.exports = {
   
    sendTeamsMessage,
    sendTeamsMessageCron,
    calculateInTime,
    calculateOutTime,
    getTimeString
    
};