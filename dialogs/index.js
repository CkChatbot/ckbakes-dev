const { Menu } = require('./Food/menu');
const {CategoryDialog} = require('./Food/category')

const {InitialDialog} = require('./intialDialog/initialDialog');
const {ApproveOrderDialog} = require('./Food/approveOrderDialog')
const {CakeFlow} = require('./Food/cakeFlow');
const {OrderByOccasionDialog} = require('./Food/orderByOccasion')



module.exports = {
    Menu,
    CategoryDialog,
    CakeFlow,
    OrderByOccasionDialog,
   
    InitialDialog,
    ApproveOrderDialog
   
};

