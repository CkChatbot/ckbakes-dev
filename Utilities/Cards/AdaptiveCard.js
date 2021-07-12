const { MessageFactory, CardFactory } = require('botbuilder');


let menuCard = (data) => {
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "Image",
                "url": data.image,
                "size": "Large"
            },
            {
                "type": "TextBlock",
                "text": data.Name,
                "id":"Name",
                "wrap": true,
                "horizontalAlignment": "Center"
            },
            {
                "type": "TextBlock",
                "text": data.Price,
                "id":"Price",
                "wrap": true,
                "horizontalAlignment": "Center"
            },
            {
                "type": "TextBlock",
                "text": data.Description,
                "id":"desc",
                "wrap": true
            },
            {
                "type": "Input.Number",
                "placeholder": "Quantity",
                "id": "quantity"
            },
            {
                "type": "ActionSet",
                "id": "order",
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Add to cart",
                        "data":{
                            "button": "addtocart",
                            "Name":data.Name,
                            "Price":data.Price,
                            interruptIdentifier: 'addtocartint',
                            "Category":data.Category


                        }
                    }
                ]
            }
        ]
    }

 

    return CardFactory.adaptiveCard(adaptiveCard);

}

let cakeMenuCard = (data) => {
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "Image",
                "url": data.image,
                "size": "Medium"
            },
            {
                "type": "TextBlock",
                "text": data.Name,
                "wrap": true,
                "id": "cakename"
            },
            
        {
            "type": "TextBlock",
            "text": data.Price,
            "wrap": true,
            "id": "Price"
        },
        {
            "type": "TextBlock",
            "text": data.Description,
            "id":"desc",
            "wrap": true
        }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Buy Now",
                "data":{
                    "button": "addtocart",
                    "Name":data.Name,
                    "Price":data.Price,
                    interruptIdentifier: 'addtocartint',
                    "Category":data.Category


                }
            }
        ]
    }
    return CardFactory.adaptiveCard(adaptiveCard);
}

let menuCard1 = (data) => {
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "Image",
                "url": data.image,
                "size": "Large"
            },
            {
                "type": "TextBlock",
                "text": data.Name,
                "id":"Name",
                "wrap": true,
                "horizontalAlignment": "Center"
            },
            {
                "type": "TextBlock",
                "text": data.Price,
                "id":"Price",
                "wrap": true,
                "horizontalAlignment": "Center"
            },
            {
                "type": "TextBlock",
                "text": data.Description,
                "id":"desc",
                "wrap": true
            }
            
        ]
    }

 

    return CardFactory.adaptiveCard(adaptiveCard);

} 

let orderChoiceCard = ()=>{
    let adaptiveCard =  {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "TextBlock",
                "text": "New TextBlock",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "choices": [
                    {
                        "title": "Yes",
                        "value": "Yes"
                    },
                    {
                        "title": "No",
                        "value": "No"
                    }
                ],
                "placeholder": "Placeholder text",
                "style": "expanded",
                "id": "choice",
                "separator": true,
                "wrap": true
            },
            {
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Submit",
                        "style": "positive"
                    }
                ]
            }
        ]
    }
    return adaptiveCard
}

const orderCard = (data) =>{
    
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Items",
                                "wrap": true,
                                "id": "itemsdescription"
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "quantity",
                                "wrap": true,
                                "id": "quantity"
                            }
                        ]
                    }
                ]
            } 
        ],"actions": [
            {
                "type": "Action.Submit",
                "title": "Order"
            }
        ]

    }

    for (let i = 0; i < data.length; i++) {
        console.log(data[i].Name);
        adaptiveCard.body.push(
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            
                            {
                                "type": "TextBlock",
                                "text": data[i].Name,
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            
                            {
                                "type": "Input.Number",
                                "placeholder": "Placeholder tex",
                                "value": 1,
                                //"id": i.toString()
                                "id": data[i].Name
                            }
                        ]
                    }
                ]
            }
        )
        
    }
    


    return adaptiveCard
}

const scrollUp = () => {
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "TextBlock",
                "text": "To add more Items scroll up",
                "wrap": true,
                "spacing": "Large",
                "separator": true,
                "fontType": "Monospace",
                "size": "Small",
                "weight": "Bolder",
                "color": "Accent",
                "isSubtle": true
            },
            {
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Confirm Order",
                        "style": "positive"
                    }
                ]
            }
        ]
    }

    return adaptiveCard;
}



const orderSummary = (items) => {

    console.log(items.length);
    for (let i = 0; i < items.length; i++) {
        console.log(items[i]);
        console.log(items[i].Name);
        console.log(items[i].Price);
        console.log(items[i].quantity);
        
    }

    
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "TextBlock",
                "text": "Orders Received Successfully",
                "wrap": true,
                "color": "Good",
                "weight": "Bolder",
                "fontType": "Default",
                "horizontalAlignment": "Center"
            },
            {
                "type": "TextBlock",
                "text": "Total Price",
                "wrap": true,
                "weight": "Bolder",
                "separator": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Items",
                                "wrap": true,
                                "weight": "Bolder",
                                "separator": true
                               
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Quantity",
                                "wrap": true,
                                "weight": "Bolder",
                                "separator": true
                                
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Price",
                                "wrap": true,
                                "weight": "Bolder",
                                "separator": true
                                
                            }
                        ]
                    }
                ]
            }
        ]
        
       
        
    }

    if (items.length > 0) {
        items.forEach(element => {
            adaptiveCard.body.push({
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            
                            {
                                "type": "TextBlock",
                                "text": element.Name,
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            
                            {
                                "type": "TextBlock",
                                "text": element.quantity,
                                "wrap": true
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            
                            {
                                "type": "TextBlock",
                                "text": element.Price,
                                "wrap": true
                            }
                        ]
                    }
                ]
            });
        });
    }
    else {
        adaptiveCard.body.push({
            "type": "TextBlock",
            "text": "No data to display",
            "spacing": "Small",
            "wrap": true
        });
    }

    

 
    return adaptiveCard;
}

const addUpCard = () => {
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "TextBlock",
                "text": "Do you wish to",
                "wrap": true,
                "isSubtle": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "ActionSet",
                                "actions": [
                                    {
                                        "type": "Action.Submit",
                                        "title": "Add More Items",
                                        "id": "addMoreItems",
                                        interruptIdentifier: "add more items"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "ActionSet",
                                "actions": [
                                    {
                                        "type": "Action.Submit",
                                        "title": "Confirm Order",
                                        "id": "confirmOrder",
                                        interruptIdentifier: "confirm order"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

    return adaptiveCard;
}

const paymentCard = () => {
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "TextBlock",
                "text": "Please provide the following information:",
                "wrap": true
            }
        ],
        "actions": [
            {
                "type": "Action.ShowCard",
                "title": "Name",
                "card": {
                    "type": "AdaptiveCard",
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "version": "1.2",
                    "body": [
                        {
                            "type": "Input.Text",
                            "placeholder": "First Name",
                            "id": "name"
                        },
                        {
                            "type": "Input.Text",
                            "placeholder": "Last Name",
                            "id": "lname"
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.ShowCard",
                            "title": "Address",
                            "card": {
                                "type": "AdaptiveCard",
                                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                "version": "1.2",
                                "body": [
                                    {
                                        "type": "Input.Text",
                                        "placeholder": "Address line 1",
                                        "id": "addrline1"
                                    },
                                    {
                                        "type": "Input.Text",
                                        "placeholder": "Address line 2",
                                        "id": "addrline2"
                                    },
                                    {
                                        "type": "ColumnSet",
                                        "columns": [
                                            {
                                                "type": "Column",
                                                "width": "stretch",
                                                "items": [
                                                    {
                                                        "type": "Input.Text",
                                                        "placeholder": "City",
                                                        "id": "city"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Column",
                                                "width": "stretch",
                                                "items": [
                                                    {
                                                        "type": "Input.Text",
                                                        "placeholder": "State",
                                                        "id": "state"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Column",
                                                "width": "stretch",
                                                "items": [
                                                    {
                                                        "type": "Input.Text",
                                                        "placeholder": "Zip code",
                                                        "id": "zipcode"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "actions": [
                                    {
                                        "type": "Action.ShowCard",
                                        "title": "Phone/Email",
                                        "card": {
                                            "type": "AdaptiveCard",
                                            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                            "version": "1.2",
                                            "body": [
                                                {
                                                    "type": "Input.Text",
                                                    "placeholder": "Mobile Number",
                                                    "id": "mobilenum",
                                                    "maxLength": 10
                                                },
                                                {
                                                    "type": "Input.Text",
                                                    "placeholder": "Alternate Number",
                                                    "maxLength": 10,
                                                    "id": "alternatenum"
                                                },
                                                {
                                                    "type": "Input.Text",
                                                    "placeholder": "Email address",
                                                    "id": "email"
                                                },
                                                {
                                                    "type": "TextBlock",
                                                    "text": "Expected Date of Delivery",
                                                    "wrap": true
                                                },
                                                {
                                                    "type": "Input.Date",
                                                    "id": "date"
                                                }
                                            ],
                                            "actions": [
                                                {
                                                    "type": "Action.Submit",
                                                    "title": "Submit",
                                                    "data":{
                                                        "button": "addresssubmit",
                                                        
                                                        interruptIdentifier: 'addresssubmitint'
                                                        


                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
    return adaptiveCard;
}

let welcomeCard = () =>{
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "RichTextBlock",
                                "inlines": [
                                    {
                                        "type": "TextRun",
                                        "text": "Honey Bakes",
                                        "size": "Large",
                                        "horizontalAlignment": "Center"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [
                            {
                                "type": "Image",
                                "url": "https://vofcust.blob.core.windows.net/chatbot-images/cake.jpg"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Hey there I am Here to help you!!!!",
                "wrap": true,
                "fontType": "Default",
                "size": "Medium",
                "color": "Dark"
            },
            {
                "type": "TextBlock",
                "text": "Hit me with the options provided below or type below",
                "wrap": true,
                "size": "Medium",
                "color": "Dark"
            }
        ],
        "backgroundImage": {
            "url": "https://vofcust.blob.core.windows.net/chatbot-images/honey bakes.jpg",
            "fillMode": "Repeat"
        }
    }
    return adaptiveCard;
}

let muffinsCard = () =>{
    let adaptiveCard = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.2",
        "body": [
            {
                "type": "Image",
                "url": "https://vofcust.blob.core.windows.net/chatbot-images/blueberry muffins.jpg",
                "horizontalAlignment": "Center"
            }
        ]
    }
    return adaptiveCard;
}

module.exports = {
    
    menuCard,
    menuCard1,
    orderChoiceCard,
    orderCard,
    orderSummary,
    scrollUp,
    addUpCard,
    paymentCard,
    cakeMenuCard,
    welcomeCard,
    muffinsCard
}