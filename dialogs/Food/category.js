require('dotenv-extended').load();

const { ComponentDialog, Dialog, ChoicePrompt, ChoiceFactory, WaterfallDialog } = require("botbuilder-dialogs");
const { MessageFactory, CardFactory, ActivityTypes } = require('botbuilder');

const config = require("../../config/" + process.env.HOSTED_ENVIRONMENT + "_config.json");

const { DialogsId } = require('../../Utilities');

const { UserProfileData, UserProfileId, DialogOptions } = require('../../StateProperties');
const { heroCards, BotResponse } = require('../../Utilities');



const { Menu } = require('./menu');



class CategoryDialog extends ComponentDialog {
    constructor(privateConversationState) {
        super(DialogsId.CategoryDialogID);
        // Assign State object
        this.privateConversationState = privateConversationState;

        //UserPropertyAccessor
        this.userPropertyAccessor = this.privateConversationState.createProperty(UserProfileId);

        //dialogPropertyAccessor
        this.dialogPropertyAccessor = this.privateConversationState.createProperty(CategoryDialog);

        //this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new Menu(this.privateConversationState));

        this.addDialog(new WaterfallDialog(DialogsId.CategoryDialogID, [
            
            this.categoryMenu.bind(this),
            this.processChoices.bind(this),
            
        ]));

        // Sets initial dialog to run when file is begin
        this.initialDialogId = DialogsId.CategoryDialogID;
    }

    async categoryMenu(stepContext) {
        console.log("................");
        console.log("Inside categoryMenu")
        let userData = await this.userPropertyAccessor.get(stepContext.context, new UserProfileData());
        await stepContext.context.sendActivity(ChoiceFactory.heroCard(["Cookies","Cakes"],'Please select the category'));
        //await stepContext.context.sendActivity(ChoiceFactory.heroCard(["Cookies","Cakes"],'Please select the category'));
        return Dialog.EndOfTurn;
    }

    async processChoices(stepContext) {
        console.log("................");
        console.log("Inside processChoice")
        const dialogOptions = stepContext.options;
        const userInput = stepContext.result;
        switch (userInput) {
            case ("Cookies"):
                return await stepContext.beginDialog(DialogsId.menuId,{data:stepContext.result});
            case "Cakes":
                return await stepContext.beginDialog(DialogsId.menuId,{data:stepContext.result});

            

            default:
                
                await stepContext.cancelAllDialogs();
                return await stepContext.endDialog();
        }
    }

     
}

module.exports = {
    CategoryDialog
};