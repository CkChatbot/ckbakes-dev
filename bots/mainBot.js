require('dotenv-extended').load();

const { ActivityTypes, CardFactory,TurnContext, ActivityHandler, TeamsActivityHandler, MessageFactory, TeamsInfo} = require('botbuilder');
const { ComponentDialog, Dialog, ChoicePrompt, ChoiceFactory, WaterfallDialog } = require("botbuilder-dialogs");

const { convoRefService,apiService,apiStubBuilder, } = require('../services');

const config = require('../config/' + process.env.HOSTED_ENVIRONMENT + '_config.json');

const { DialogsId, cards, BotResponse, genericFunctions } = require('../Utilities');
const {DB} = require('../helper');





const { ApplicationInsightsTelemetryClient } = require('botbuilder-applicationinsights');
var telemetryClient = new ApplicationInsightsTelemetryClient(config.AzureServices.AppInsights.INSTRUMENT_KEY);


const {UserProfileData} = require('../StateProperties');

/**
 *
 * MainBot Class is responsible for 4 main things -
 *   1. Handle different types of activities
 *   2. Process incoming activities and extract relevant information into an onTurnProperty object
 *   3. Route message to or start an instance of main dispatcher
 *   4. Welcome user(s) that might have joined the conversation
 *   @class
 */



// Unique identifiers for state properties
class MainBot extends TeamsActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(storage, privateConversationState, conversationState, userState, dialog, conversationReferences) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.storage = storage;
        
        this.conversationState = conversationState;
        
        this.userState = userState;
        
        this.privateConversationState = privateConversationState;
        
        this.conversationReferences = conversationReferences;
        
        

        // UserData Property Accessor
        this.userPropertyAccessor = this.privateConversationState.createProperty('UserProfileId');

        


        //this.cachePropetyAccessor = this.privateConversationState.createProperty(CacheProperty);
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        /* this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    const reply = `Welcome to Moon Bakes Bot. Type Hi to Order Cookies and Cakes.`;
                    await context.sendActivity(reply);
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        }); */

        this.onConversationUpdate(async(context, next) => { 
            ////console.log("context",context.activity);
            //console.log(context.activity.recipient.id)
            //console.log(context.activity.membersAdded[0].id)

            if(context.activity.recipient.id === context.activity.membersAdded[0].id){
                console.log("same 1st time")
                let cardToSend = cards.welcomeCard();
                await context.sendActivity({attachments:[CardFactory.adaptiveCard(cardToSend)]}); 
                //return Dialog.EndOfTurn;
                await context.sendActivity('Quick links');
                await context.sendActivity('Order by')

                await context.sendActivity(ChoiceFactory.heroCard(["Occasion", "Type", "Flavour","Price"]));
                await context.sendActivity('Our Best Sellers');
                var pre_query = new Date().getTime();
                let dbData = await DB.dataAccessor("Cakes");
                var post_query = new Date().getTime();
                var duration = (post_query - pre_query) / 1000;
                console.log('queryTime',duration)
                let cardArray = [];
                for (let i = 0; i < dbData.result.length; i++) {
                    cardArray.push(cards.cakeMenuCard(dbData.result[i]));
                } 
                await context.sendActivity(MessageFactory.carousel(cardArray)); 
                return Dialog.EndOfTurn;

                //await context.sendActivity({ attachments: [this.createHeroCard()] });
            }

            

            

 

            //Send your message here
            
             
            
            });

        this.onMessage(async (context, next) => {
            console.log('Inside OnMessage');
            

            this.adapter = context.adapter;

            await this.dialog.run(context, this.dialogState);

            
            let userData = await this.userPropertyAccessor.get(context, new UserProfileData());
            
            await next();
            
        });

        

        
    }

    

    
    
    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     * @param {context} TurnContext object containing info
     */

    async run(context) {
        await super.run(context);
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
        await this.privateConversationState.saveChanges(context, false);
    }

    createHeroCard() {
        return CardFactory.heroCard(
            'BotFramework Hero Card',
            CardFactory.images(['https://vofcust.blob.core.windows.net/chatbot-images/honey bakes.jpg']),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Get started',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
                }
            ])
        );
    }

    

    
}

module.exports.MainBot = MainBot;
