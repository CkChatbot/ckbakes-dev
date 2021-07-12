const { TurnContext } = require('botbuilder');
const { BlobStorage } = require('botbuilder-azure');

const addConversationRefs = async (storage, email, activity) => {
    try {
        let storedData = await storage.read([email]);
        let convoData = storedData[email];
        if (typeof (convoData) != 'undefined') {
            return true;
        } else {
            let conversationReference = TurnContext.getConversationReference(activity);
            storedData[email] = { conversationReference, "eTag": "*" };
            await storage.write(storedData);
            return true;
        }
    } catch (error) {
        // TODO Triger email to relevant people
        console.log(error);
        //await genericFunctions.sendEmail(send_Mails_To, "Error in BOT", error); //TODO send mail to admin of the bot

        return false;
    }

};

const getConversationRefs = async (storage, email) => {
    try {
        let storedData = await storage.read([email]);
        console.log(storedData);
        let convoData = storedData[email];
        if (typeof (convoData) != 'undefined') {
            return { status: true, Message: 'We got the data', conversationReference: storedData[email].conversationReference };
        } else {
            return { status: false, Message: 'No Data Available' };
        }
    } catch (error) {
        // TODO Triiger email to relevant people
        console.log(error);
        return { status: false, Message: error };
    }
};


module.exports = {
    addConversationRefs,
    getConversationRefs
};