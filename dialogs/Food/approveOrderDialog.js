/* eslint-disable no-async-promise-executor */
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

require('dotenv-extended').load();
const { ComponentDialog, Dialog, TextPrompt,ChoicePrompt,ConfirmPrompt, ChoiceFactory, WaterfallDialog } = require("botbuilder-dialogs");
const { MessageFactory, CardFactory, ActivityTypes, AttachmentLayoutTypes } = require('botbuilder');

const { UserProfileId, UserProfileData} = require('../../StateProperties');



const {DB} = require('../../helper');


const { DialogsId, cards, BotResponse, genericFunctions } = require('../../Utilities');

const {InitialDialog} = require('../intialDialog/initialDialog');




const moment = require('moment');

const TEXT_PROMPT = 'TEXT_PROMPT'

class ApproveOrderDialog extends ComponentDialog {
    constructor(privateConversationState) {
        super(DialogsId.approveOrderID);

        this.privateConversationState = privateConversationState;
        //this.storage = storage;

        //UserPropertyAccessor
        this.userPropertyAccessor = this.privateConversationState.createProperty(UserProfileId);

        //dialogPropertyAccessor
        this.dialogPropertyAccessor = this.privateConversationState.createProperty(ApproveOrderDialog);

        this.addDialog(new InitialDialog(this.privateConversationState));
        this.addDialog(new TextPrompt(TEXT_PROMPT));


        // Initial waterfall dialog.
        this.addDialog(new WaterfallDialog(DialogsId.approveOrderID, [
            this.approveOrder.bind(this),
            this.showOffer.bind(this),
            this.payment.bind(this)
          
        ]));

        this.initialDialogId = DialogsId.approveOrderID;
    }

    async approveOrder(stepContext) {
        console.log('ApproveOrderDialog---approveOrder')

        const dialogOptions = stepContext.options;
        console.log('dialogOptions',dialogOptions);
        if(dialogOptions.intent){
            return await stepContext.next(dialogOptions.intent);
        }
        
    
        const userData = await this.userPropertyAccessor.get(stepContext.context, new UserProfileData());
        console.log('before userData.item:',userData.item)
        userData.item.push(dialogOptions.data)
        console.log('after userData.item:',userData.item);

        if (dialogOptions.data.button === 'addtocart') {
            let cardToSend = cards.paymentCard();

            switch(dialogOptions.data.Category){
                case "Cookies":
                    if(dialogOptions.data.quantity === null || dialogOptions.data.quantity === ""){
                        await stepContext.context.sendActivity('Pls enter the quantity');
                        return await stepContext.endDialog();
                    }else{
                        await stepContext.context.sendActivity(`Buy ${dialogOptions.data.Name}:${dialogOptions.data.quantity} .`);
                        await stepContext.context.sendActivity('Alright Please enter your address details and contact details')
                        
                        await stepContext.context.sendActivity({attachments:[CardFactory.adaptiveCard(cardToSend)]});
                        return Dialog.EndOfTurn;

                    }
                   
                    break;
                case "Cakes":
                    
                    await stepContext.context.sendActivity(`Buy ${dialogOptions.data.Name}.`);
                    await stepContext.context.sendActivity('Alright Please enter your address details and contact details')
                    
                    await stepContext.context.sendActivity({attachments:[CardFactory.adaptiveCard(cardToSend)]});
                    return Dialog.EndOfTurn;
                   
                    
                    
                default:
                    break;

            } 

            
           
            
            
                
            

            
        }
        
    }

    async showOffer(stepContext){
        console.log('Inside showOffer');
        
        console.log('stepresult',stepContext.result)
        if(stepContext.result){
            return await stepContext.next(stepContext.result);
        }
    
        
        let cardToSend = cards.muffinsCard();
        await stepContext.context.sendActivity({attachments:[CardFactory.adaptiveCard(cardToSend)]}); 
        await stepContext.prompt(TEXT_PROMPT,"Would you also like to have pack of 5 homemade blueberry muffins for just Rs 250 more?");
        
        
        

       
    }

    async payment(stepContext){
        console.log('Inside Payment');
        console.log('stepres',stepContext.result);
        switch (stepContext.result){
            case 'communication_confirm':
                await stepContext.context.sendActivity('Perfect your total billed amount is 987 INR.');
                await stepContext.context.sendActivity('How would you like to make your payment');
                await stepContext.context.sendActivity(ChoiceFactory.heroCard(["Credit Card", "Debit card", "Net Banking","cash on delivery","UPI"]));
                return stepContext.endDialog();
            case 'utilities_reject':
                await stepContext.context.sendActivity('Perfect your total billed amount is 750 INR.');
                await stepContext.context.sendActivity('How would you like to make your payment');
                await stepContext.context.sendActivity(ChoiceFactory.heroCard(["Credit Card", "Debit card", "Net Banking","cash on delivery","UPI"]));
                return stepContext.endDialog();
            default:
                break;
        }
        
        
        
    }

   
}

module.exports.ApproveOrderDialog = ApproveOrderDialog;
