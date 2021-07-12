require('dotenv-extended').load();
const { ComponentDialog, Dialog, ChoicePrompt, ChoiceFactory, WaterfallDialog } = require("botbuilder-dialogs");
const { MessageFactory, CardFactory, ActivityTypes } = require('botbuilder');


const { UserProfileId, UserProfileData } = require('../../StateProperties');

const config = require("../../config/" + process.env.HOSTED_ENVIRONMENT + "_config.json");

const { DialogsId, cards, BotResponse } = require('../../Utilities');

const CHOICEPROMPT = 'CHOICEPROMPT';

class InitialDialog extends ComponentDialog {
    constructor(privateConversationState) {
        super(DialogsId.initialDialogId);
        // Assign State object
        this.privateConversationState = privateConversationState;

        //UserPropertyAccessor
        this.userPropertyAccessor = this.privateConversationState.createProperty(UserProfileId);

        //dialogPropertyAccessor
        this.dialogPropertyAccessor = this.privateConversationState.createProperty(InitialDialog);

        this.addDialog(new ChoicePrompt(CHOICEPROMPT))
            .addDialog(new WaterfallDialog(DialogsId.initialDialogId, [
                this.initialMenu.bind(this),
                this.buttonRedirect.bind(this)
            ]));
        // Sets initial dialog to run when file is begin
        this.initialDialogId = DialogsId.initialDialogId;
    }

    async initialMenu(stepContext) {
        console.log('..............');
        console.log('Inside Initial Dialog----initial menu')
        
        //await stepContext.context.sendActivity(`Hi I am your Digital Assistance`);
        await stepContext.context.sendActivity(ChoiceFactory.heroCard(["Menu", "Get Directions", "Order"],`Please type your question or select an option from the below menu.`));
        
        return Dialog.EndOfTurn;
    }

    async buttonRedirect(stepContext) {
        console.log('Inside Initial Dialog----button redirect')
        

        switch (stepContext.result.toLowerCase()) {
            
            case 'menu':
                return await stepContext.replaceDialog(DialogsId.menuId);
                //return await stepContext.replaceDialog(DialogsId.CategoryDialogID);
            case 'get directions':
                return await stepContext.replaceDialog(DialogsId.punchStatusID);
            case 'order':
                return await stepContext.replaceDialog(DialogsId.CategoryDialogID);
            default:
                await stepContext.cancelAllDialogs();
                return await stepContext.endDialog();
        }
    }
}

module.exports.InitialDialog = InitialDialog;