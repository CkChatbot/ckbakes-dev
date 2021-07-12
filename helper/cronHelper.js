require('dotenv-extended').load();

const { loggerService, convoRefService,apiService,apiStubBuilder } = require('../services');
const { sendTeamsMessage, sendTeamsMessageCron } = require('../Utilities/helper/genericFunction');
const { DialogsId} = require('../Utilities')

const cronDecider = async(notYetPunchedUsers_list,date,memoryStorage,adapter) => {
    let unableToMsgList = []
    for (let i = 0; i < notYetPunchedUsers_list.result.length; i++) {
        let sendMailTo = notYetPunchedUsers_list.result[i].Email_code;

        const requestOptionsforHolidays = apiStubBuilder.getEmployeeStubforHolidays(sendMailTo);
        let holidaysData = await apiService.CallApi(requestOptionsforHolidays, sendMailTo);
        let localList = [];
        //let localListTest = ['Feb 15 2021','Feb 16 2021'];

        for (let i = 0; i < holidaysData.data.length; i++) {
            
            localList.push((holidaysData.data[i].date).replace(",",""));
            
            
        }
        console.log('locallist',localList); 

        

        

        console.log(sendMailTo)
        const message = DialogsId.message_NotPunched
        let conversationReference = await convoRefService.getConversationRefs(memoryStorage,sendMailTo);

        if(conversationReference.status){
            if(localList.includes(date)){
                console.log('Its a holiday');
    
            }else{
                await sendTeamsMessageCron(message, conversationReference.conversationReference,adapter)

            }
                
            
        }else{
            unableToMsgList.push(sendMailTo);
            console.log('unabletomsglist',sendMailTo);
            continue;

        }

        

        
        
    }


}

module.exports = {
    cronDecider
}