const BotResponseMessages = {
    BotMessages: {
        greetingMessage: (FullName) => `Hi **${FullName}**, I'm Cavin. Your Digital Assistant. I can help you with HR related queries`,
        InitialMenuTitleMessage: `Please type your question or select an option from the below menu.`,
        
    },
    Menu: {
        title:"Select the  Category:",
        Category:[
            "Cookies",
            "Cakes"
        ]

    }
    
    
};

module.exports = {
    BotResponseMessages
    
};
