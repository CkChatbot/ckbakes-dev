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

class OrderByOccasionDialog extends ComponentDialog {
    constructor(privateConversationState) {
        super(DialogsId.OrderByOccasionDialogID);

        this.privateConversationState = privateConversationState;
        //this.storage = storage;

        //UserPropertyAccessor
        this.userPropertyAccessor = this.privateConversationState.createProperty(UserProfileId);

        //dialogPropertyAccessor
        this.dialogPropertyAccessor = this.privateConversationState.createProperty(OrderByOccasionDialog);

        //this.addDialog(new InitialDialog(this.privateConversationState));
        this.addDialog(new TextPrompt(TEXT_PROMPT));


        // Initial waterfall dialog.
        this.addDialog(new WaterfallDialog(DialogsId.OrderByOccasionDialogID, [
            this.selectOccasionType.bind(this),
            this.selectForWhom.bind(this),
            this.callingDb.bind(this)
          
        ]));

        this.initialDialogId = DialogsId.OrderByOccasionDialogID;
    }

    async selectOccasionType(stepContext) {
        console.log('inside OrderByOccasion-selectOccasionType')
        await stepContext.context.sendActivity(ChoiceFactory.heroCard(["Anniversary", "Birthday", "Congratulations","ThankYou"]));
        //return await stepContext.endDialog();
        return Dialog.EndOfTurn
        
    }

    async selectForWhom(stepContext){
        console.log('inside OrderByOccasion-selectForWhom');
        console.log(stepContext.result)
        switch(stepContext.result){
            case "Anniversary":
                
                await stepContext.context.sendActivity('You want Anniversary cakes for');
                await stepContext.context.sendActivity(ChoiceFactory.heroCard(["Wife", "Husband", "Parents","Friends"]));
                return Dialog.EndOfTurn;
                
            case "Birthday":
                await stepContext.context.sendActivity('You want Birthday cakes for');
                await stepContext.context.sendActivity(ChoiceFactory.heroCard(["BoyFriend", "GirlFriend", "Parents","Siblings","Wife"]));
                return Dialog.EndOfTurn;
            case "Congratulations":
                break;
            case "ThankYou":
                break;
            default:
                break;

        }



    }

    async callingDb(stepContext){
        console.log('inside OrderByOccasion-callingDb');
        var pre_query = new Date().getTime();
        let dbData = await DB.dataAccessor("Cakes");
        var post_query = new Date().getTime();
        var duration = (post_query - pre_query) / 1000;
        console.log('queryTime',duration)
        let cardArray = [];
        for (let i = 0; i < dbData.result.length; i++) {
            cardArray.push(cards.cakeMenuCard(dbData.result[i]));
        } 
        await stepContext.context.sendActivity(MessageFactory.carousel(cardArray)); 
        return Dialog.EndOfTurn;
    }

   
}

module.exports.OrderByOccasionDialog = OrderByOccasionDialog;
