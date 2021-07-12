require('dotenv-extended').load();
const { ComponentDialog, Dialog, ChoicePrompt,ConfirmPrompt, ChoiceFactory, WaterfallDialog } = require("botbuilder-dialogs");
const { MessageFactory, CardFactory, ActivityTypes, AttachmentLayoutTypes } = require('botbuilder');
const { UserProfileId, UserProfileData} = require('../../StateProperties');
const { DialogsId, cards, genericFunctions} = require('../../Utilities');
const {DB} = require('../../helper');
//const dbData = await DB.dataAccessor();
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const { ApproveOrderDialog } = require('../Food/approveOrderDialog');
//const { CakeFlow } = require('../Food/cakeFlow');
class Menu extends ComponentDialog {
    constructor(privateConversationState) {
        super(DialogsId.menuId);
        // Assign State object
        this.privateConversationState = privateConversationState;
        //UserPropertyAccessor
        this.userPropertyAccessor = this.privateConversationState.createProperty(UserProfileId);
        //dialogPropertyAccessor
        this.dialogPropertyAccessor = this.privateConversationState.createProperty(Menu);
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ApproveOrderDialog(this.privateConversationState));
        //this.addDialog(new CakeFlow(this.privateConversationState));
        this.addDialog(new WaterfallDialog(DialogsId.menuId, [
            this.showMenu.bind(this),
            //this.buyNow.bind(this)
        ]));
        // Sets initial dialog to run when file is begin
        this.initialDialogId = DialogsId.menuId;
    }
    async showMenu(stepContext) {
        console.log("................");
        console.log("Inside updateMenu")
        const dialogOptions = stepContext.options.data;  // getting dynamic data - cookies else cakes 
        console.log('dialogOptions',dialogOptions);
        let userData = await this.userPropertyAccessor.get(stepContext.context, new UserProfileData());
        var pre_query = new Date().getTime();
        let dbData = await DB.dataAccessor(dialogOptions);
        var post_query = new Date().getTime();
        var duration = (post_query - pre_query) / 1000;
        console.log('queryTime',duration)
        stepContext.options.dbdata1 = dbData;
        if(dialogOptions === "Cookies"){
            let cardArray = [];
            for (let i = 0; i < dbData.result.length; i++) {
                cardArray.push(cards.menuCard(dbData.result[i]));
            } 
            await stepContext.context.sendActivity(MessageFactory.carousel(cardArray)); 
            return Dialog.EndOfTurn;

        }else{
            let cardArray = [];
            for (let i = 0; i < dbData.result.length; i++) {
                cardArray.push(cards.cakeMenuCard(dbData.result[i]));
            } 
            await stepContext.context.sendActivity(MessageFactory.carousel(cardArray)); 
            return Dialog.EndOfTurn;

        }
        
       
     }

     

    
}
module.exports.Menu = Menu;
