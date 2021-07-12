require('dotenv-extended').load();
const { ComponentDialog, Dialog, ChoicePrompt,ConfirmPrompt, ChoiceFactory, WaterfallDialog } = require("botbuilder-dialogs");
const { MessageFactory, CardFactory, ActivityTypes, AttachmentLayoutTypes } = require('botbuilder');
const { UserProfileId, UserProfileData} = require('../../StateProperties');
const { DialogsId, cards, genericFunctions} = require('../../Utilities');
const {DB} = require('../../helper');
//const dbData = await DB.dataAccessor();
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const { ApproveOrderDialog } = require('./approveOrderDialog');
const { Menu } = require('./menu');

class CakeFlow extends ComponentDialog {
    constructor(privateConversationState) {
        super(DialogsId.cakeFlowDialogID);
        // Assign State object
        this.privateConversationState = privateConversationState;
        //UserPropertyAccessor
        this.userPropertyAccessor = this.privateConversationState.createProperty(UserProfileId);
        //dialogPropertyAccessor
        this.dialogPropertyAccessor = this.privateConversationState.createProperty(CakeFlow);
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new ApproveOrderDialog(this.privateConversationState));
        this.addDialog(new Menu(this.privateConversationState));
        this.addDialog(new WaterfallDialog(DialogsId.cakeFlowDialogID, [
            this.showSize.bind(this),
            this.confirmFlavour.bind(this),
            this.showFlavour.bind(this)
        ]));
        // Sets initial dialog to run when file is begin
        this.initialDialogId = DialogsId.cakeFlowDialogID;
    }
    async showSize(stepContext) {
        console.log("................");
        console.log("Inside ShowSize")
        
        let userData = await this.userPropertyAccessor.get(stepContext.context, new UserProfileData());
        await stepContext.context.sendActivity('Sure I can help you with that.');
        await stepContext.context.sendActivity('What size are you looking for?');
        await stepContext.context.sendActivity(ChoiceFactory.heroCard(['0.5 kg','1 kg','2 kg']));
        return Dialog.EndOfTurn;
     }
     async confirmFlavour(stepContext) {
        console.log("................");
        console.log("Inside confirmFlavour")
        
        
        let userData = await this.userPropertyAccessor.get(stepContext.context, new UserProfileData());
        return await stepContext.prompt(CONFIRM_PROMPT,'Do you prefer any particular flavour?',['yes','no']);
        
     }

     async showFlavour(stepContext){
        console.log("................");
        console.log("Inside showFlavour")
        let userData = await this.userPropertyAccessor.get(stepContext.context, new UserProfileData());
        let result = stepContext.result;
        if(!result){
            await stepContext.context.sendActivity('Here are few hanpicked options for you...')
            return await stepContext.beginDialog(DialogsId.menuId,{data:"Cakes"});

        }
        
        
        
        
        
        

     }
    
}
module.exports.CakeFlow = CakeFlow;
