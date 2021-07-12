// Restify for creating server
const restify = require('restify');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const {DB} = require('./helper');

require('dotenv-extended').load();

// Import bot services
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState, PrivateConversationState, ActivityTypes, StreamingHttpClient, MicrosoftAppCredentials,ShowTypingMiddleware } = require("botbuilder");
const { BlobStorage } = require('botbuilder-azure');
// importing mainBot
const { MainBot } = require('./bots');
const { MainDispatcher } = require('./dispatcher');
const { loggerService, convoRefService,apiService,apiStubBuilder } = require('./services');
const { sendTeamsMessage, sendTeamsMessageCron } = require('./Utilities/helper/genericFunction');
const { DialogsId} = require('./Utilities')
const {cronHelper} = require('./helper')

// UserState Identifier
const { UserProfileData, UserProfileId } = require('./StateProperties');

const config = require("./config/" + process.env.HOSTED_ENVIRONMENT + "_config.json");

// Setting up the Environment
const ENV = process.env.ENV;

// creating bot adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID,
    appPassword: process.env.MicrosoftAppPassword
});

// Define a state store
let conversationState, userState, privateConversationState;

// For Dev storage
const memoryStorage = new BlobStorage({
    containerName: config.Storage.BotStateStorage.BlobName,
    storageAccountOrConnectionString: config.Storage.BotStateStorage.BlobConnectionString
});

conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);
privateConversationState = new PrivateConversationState(memoryStorage);

// Accessor created for the use of middleware activity logger function
let userDataAccessor = privateConversationState.createProperty('UserProfileId');


/**
 * Middleware to log every in and out activities going through Bot
 * @param  {TurnContext} context
 * @param  {} next for calling next Handler in queue
 */

adapter.use(async (context, next) => {



    let userData = await userDataAccessor.get(context, new UserProfileData());

    //console.log(context.activity);

    if (context.activity.channelId === 'msteams') {
        // Implementation for incoming activities // For Emulator user is checked
        if (context.activity.type !== "conversationUpdate") {
            loggerService.logIncomingActivity(context, userData);
        }
    }

    // Implementation for Outgoing activities
    let botReply = "";
    context.onSendActivities(
        async (context, activities, nextsend) => {

            activities
                .filter((a) => a.type === "message")
                .forEach(async (activity) => {
                    if (activity.text) {
                        botReply = activity.text;
                    }
                    if (activity.attachments) {
                        botReply = JSON.stringify(activity.attachments);
                    }
                    if (activity.channelId === 'msteams') {
                        loggerService.logOutgoingActivity(context, userData, activity, botReply);
                    }
                });

            // Allow the sendActivity process to continue.
            await nextsend();
        }
    );

    // Yield control for next function in queue
    await next();
});

// catch-all for errors in bot.
adapter.onTurnError = async (context, error) => {
    console.log(error);
    /* let userData = await userDataAccessor.get(context, new UserProfileData());
    await context.sendTraceActivity('OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );
    await context.sendActivity("I didn’t quite catch you, please try again.");
    loggerService.errorLogger(context, userData, error); */
    await conversationState.delete(context);
};

const conversationReferences = {};
const cronUserData = {};

//holiday list api in cron 
//list of holidays
//



/* cron.schedule("10 9 * * *", async () => {
    console.log('..............');
    console.log('Running CRON');
    
    var datetime = String(new Date());
    let date = datetime.substring(4,16);
    //let date = 'Jan 14 2021'
    //console.log('date',date);

    let notYetPunchedUsers_list = await DB.notYetPunchedUsers(date);

    await cronHelper.cronDecider(notYetPunchedUsers_list,date,memoryStorage,adapter);

}); */



// Define main bot

let bot;

// Define main Dispatcher
let mainDispatcher = new MainDispatcher(privateConversationState, memoryStorage);

try {
    bot = new MainBot(memoryStorage, privateConversationState, conversationState, userState, mainDispatcher,conversationReferences);
} catch (err) {
    console.error(`[botInitializationError]: ${err}`);
    loggerService.errorLogger(context, userDetails, err);
    process.exit();
}
 
// Create HTTP server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`\n${server.name} listening to ${server.url}`);
});

// Listen for user activity and route them.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (turnContext) => {
        await bot.run(turnContext);
    });
});

//adapter.use(new ShowTypingMiddleware('3000', '4000'));


    

// Listen for Upgrade requests for Streaming.
server.on('upgrade', (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });
    // Set onTurnError for the BotFrameworkAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;
 
    streamingAdapter.useWebSocket(req, socket, head, async (context) => {
        // After connecting via WebSocket, run this logic for every request sent over
        // the WebSocket connection.
        await bot.run(context);
    });
});  
  

