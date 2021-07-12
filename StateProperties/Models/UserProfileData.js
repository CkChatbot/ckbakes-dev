// State property Identifier

const UserProfileId = 'UserProfileId';

class UserProfileData {
    constructor() {

        this.user = null;
        this.ChannelID = null;
        this.Name = null;
        this.EmployeeLANID = null;
        this.EMAIL = null;
        this.Orders = [];
        this.item = [];
        this.intent = null;
    }
}

module.exports = {
    UserProfileData,
    UserProfileId
};