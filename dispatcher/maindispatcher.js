const { MessageFactory, InputHints, CardFactory, ActivityTypes} = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ChoiceFactory,Dialog } = require('botbuilder-dialogs');
const { DB } = require('../helper');

const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { cards, DialogsId} = require('../Utilities');
const {UserProfileData, UserProfileId} = require('../StateProperties');

require('dotenv-extended').load();

const config = require("../config/" + process.env.HOSTED_ENVIRONMENT + "_config.json");

// Import Dialogs
const { Menu,InitialDialog,ApproveOrderDialog,CategoryDialog,CakeFlow,OrderByOccasionDialog} = require('../dialogs');



const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

//TODO separate Luis for FAQ and transaction dialogs

const luisConfig = {
    applicationId: config.AzureServices.Luis.MainDispatcher.LuisAppId,
    endpointKey: config.AzureServices.Luis.MainDispatcher.LuisAPIKey,
    endpoint: config.AzureServices.Luis.MainDispatcher.LuisAPIHostName
}; 

console.log("luisconfig:",luisConfig)

class MainDispatcher extends ComponentDialog {
    constructor(privateConversationState, storage) {
        super('MainDispatcher');

        //Assign State object
        this.privateConversationState = privateConversationState;
        this.storage = storage;

        this.recognizerOptions = {
            apiVersion: 'v3'
        };

        // Luis instance
        this.recognizer = new LuisRecognizer(luisConfig, {
            apiVersion: 'v3',
                includeAllIntents: true,
                includeInstanceData: true
            }, true
        );

        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.callLuis.bind(this),
                //this.finalStep.bind(this)

            ]));

        /* 
            Add Child Dialogs
        */
        this.addDialog(new InitialDialog(privateConversationState));
        this.addDialog(new Menu(privateConversationState));
        this.addDialog(new ApproveOrderDialog(privateConversationState));
        this.addDialog(new CategoryDialog(privateConversationState));
        this.addDialog(new CakeFlow(privateConversationState));
        this.addDialog(new OrderByOccasionDialog(privateConversationState));
        

        this.initialDialogId = MAIN_WATERFALL_DIALOG;

        // Dev test
        this.userPropertyAccessor = this.privateConversationState.createProperty(UserProfileId);
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        } 
    }

    async callLuis(stepContext) {
        const luisResult = await this.recognizer.recognize(stepContext.context)
        const intent = LuisRecognizer.topIntent(luisResult); 
        const userData = await this.userPropertyAccessor.get(stepContext.context, new UserProfileData());
        userData.intent = intent;

        console.log('intent',intent)

        console.log("...................");
        console.log("Inside Main Dispatcher");
        
        //console.log("Activity comming to dispatcher====>", stepContext.context.activity.text)
        //console.log("INT Activity comming to dispatcher====>", stepContext.context.activity.value)
        //console.log("stepcontextOptions:",stepContext.options);

        //case to handle card submit


        if (stepContext.context.activity.value && stepContext.context.activity.value.interruptIdentifier) {
            const cardInt = stepContext.context.activity.value.interruptIdentifier;

            switch (cardInt) {
                case 'addtocartint':
                    console.log('addtocartint');
                    return await stepContext.beginDialog(DialogsId.approveOrderID, { data: stepContext.context.activity.value });
                case 'addresssubmitint':
                    console.log('inside addresssubmitint');
                    return await stepContext.beginDialog(DialogsId.approveOrderID, { addrdata: stepContext.context.activity.value });

                case 'proceedwithpayment':
                    console.log("Inside Main dispatcher proceedwithpayment");
                    let cardToSend = cards.paymentCard();
                    await stepContext.context.sendActivity({attachments:[CardFactory.adaptiveCard(cardToSend)]}); 
                    return Dialog.EndOfTurn;
                    
                default:
                    await stepContext.context.sendActivity(`Type Menu to proceed`);
                    return await stepContext.endDialog();

                
            }
        } else{
            //const userInput = stepContext.context.activity.text.toLowerCase()
            const userInput = intent.toLowerCase()
        try {
            if(!userInput || userInput === ''){
                console.log('NO user input')
            }
            //let onTurnProperty = await LuisData(this.recognizer, stepContext);

            
            switch(userInput){

                case 'greetings':
                    console.log("Inside Main Dispatcher------>",userInput);
                    return await stepContext.beginDialog(DialogsId.initialDialogId);

                case 'communication_confirm':
                    console.log("Inside Main Dispatcher Communication.Confirm------>",userInput);
                
                    
                    


                    return await stepContext.beginDialog(DialogsId.approveOrderID,{intent:userInput});
                    //break;

                case 'utilities_reject':
                    console.log("Inside Main Dispatcher Utilities.Reject------>",userInput);
                    return await stepContext.beginDialog(DialogsId.approveOrderID,{intent:userInput});
                    //return await stepContext.beginDialog(DialogsId.initialDialogId);
                case 'payment_options':
                    console.log("Inside Main Dispatcher Utilities.Reject------>",userInput);
                    console.log(stepContext.context.activity.text);
                    await stepContext.context.sendActivity('Woohooo!!!Your order has been placed');
                    await stepContext.context.sendActivity('It will delivered to your house within 6 hours.');
                    await stepContext.context.sendActivity('Best Wishes from Honey Bakes');
                    return await stepContext.endDialog();



                
                case 'menu':
                    console.log("Inside Main Dispatcher----->",userInput);
                    return await stepContext.beginDialog(DialogsId.menuId);
                case 'order': //order by occasion
                    console.log("Inside Main Dispatcher----->",userInput);
                    return await stepContext.beginDialog(DialogsId.CategoryDialogID);
                case 'add more items':
                    console.log("Inside Main Dispatcher----->",userInput);
                    return await stepContext.beginDialog(DialogsId.CategoryDialogID);
                case 'deliveryaddress':
                    console.log("Inside Main Dispatcher----->",userInput);
                    //return await stepContext.beginDialog(DialogsId.CategoryDialogID);
                    return await stepContext.endDialog();
                case 'bestsellingcakes':
                    console.log("Inside Main Dispatcher----->",userInput);
                
                    return await stepContext.beginDialog(DialogsId.menuId,{data:"Cakes"});

                case 'cakes':
                    console.log("Inside Main Dispatcher----->",userInput);
            
                    return await stepContext.beginDialog(DialogsId.cakeFlowDialogID);
                
                case 'occasion':
                    console.log("Inside Main Dispatcher----->",userInput);
                    return await stepContext.beginDialog(DialogsId.OrderByOccasionDialogID);
                
                    


                
                    
    
                default:
                    await stepContext.context.sendActivity(`Type Menu to proceed`);
                    return await stepContext.endDialog();
            }
    
            
        } catch (error) {
            await stepContext.context.sendActivity(`I didn't quiet catch that, please try again.`);
            console.log('Error Handler IN MAIN DISPATCHER FILE==>');
            await stepContext.cancelAllDialogs();
            return await stepContext.endDialog();
            
        }

        
        


        }

        //Luis not included as of now

        

    }

    async finalStep(stepContext) {

        //const dialogoptions = stepContext.result;

        console.log('inside final step');
        //console.log(stepContext.context.activity.value);
        return await stepContext.cancelAllDialogs();
        



    }

    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);
        // console.log("on continoue dialog result", result);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {

        /* 
            Handle cross message between user and manager
        */

        if (innerDc.context.activity.value && innerDc.context.activity.value.interruptIdentifier) {
            switch (innerDc.context.activity.value.interruptIdentifier) {
                //case 'approveLeave':
                case 'addtocartint':
                    await innerDc.cancelAllDialogs();
                    return innerDc.replaceDialog(this.id, { data: innerDc.context.activity.value,dialog: DialogsId.approveOrderID });
                case "proceedwithpayment":
                    console.log("1.Inside Main dispatcher proceedwithpayment");
                    await innerDc.cancelAllDialogs();
                    return innerDc.replaceDialog(this.id, { data: innerDc.context.activity.value, dialog:DialogsId.approveOrderID });
                //TODO
                // case 'travelEmployeeCard':
                //     await innerDc.cancelAllDialogs();
                //     return innerDc.beginDialog(this.id, { data: innerDc.context.activity.value, skipLuis: true, dialog: DialogsId.TravelEligibility });
                default:
                    return null;
            }
        }

        /* 
            Normal comman interrupt handlers 
        */
        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.toLowerCase();
            //const dialogOptions = new DialogOptions();

            console.log("interrupt Text", text);
            switch (text) {
                case 'exit':
                case 'bye':
                case 'cancel':
                case 'quit': {
                    //await innerDc.context.sendActivity(BotResponse.BotResponseMessages.BotMessages.cancelMessageText);
                    //await genericFunctions.timeout(5000);
                    await innerDc.context.sendActivity(ChoiceFactory.heroCard(["Menu", "Get Directions", "Order"],`Please type your question or select an option from the below menu.`));
                    await innerDc.cancelAllDialogs();
                }
                case 'hi': {
                    await innerDc.cancelAllDialogs();
                    //dialogOptions.interrupt = true;
                    return await innerDc.replaceDialog(this.id);
                }
                case 'cakes':
                    await innerDc.cancelAllDialogs();
                    //dialogOptions.interrupt = true;
                    return await innerDc.replaceDialog(this.id);
                case 'confirm order':
                    console.log('interrupt text - conform order')
                    break;
                
                case 'occasion':
                    console.log("Inside interrupt----->",text);
                    await innerDc.cancelAllDialogs();
                    //dialogOptions.interrupt = true;
                    return await innerDc.replaceDialog(this.id);
                
                
                default:
                    console.log('inside default interrupt in main dispatcher')
                    //return null;
            }
        }
    }

    

   
    
    
}

async function LuisData(recognizer, stepContext) {
    return new Promise(async (resolve, reject) => {
        try {
            let mainDispatchRes = await recognizer.recognize(stepContext.context);
            let mainDispatchIntent = OnTurnProperty.fromLUISResults(mainDispatchRes, null);
            console.log('intent',mainDispatchIntent);
            resolve(mainDispatchIntent)
        } catch (err) {
            console.log(err);
            loggerService.errorLogger(stepContext.context, null, err);
            //await genericFunctions.sendEmail(send_Mails_To, "Error in BOT", err); //TODO send mail to admin of the bot
            // TODO Add error logger
        }

    });
}






module.exports.MainDispatcher = MainDispatcher;