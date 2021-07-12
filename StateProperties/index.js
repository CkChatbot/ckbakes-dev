const { UserProfileId } = require('./Models/UserProfileData');

module.exports = {
    UserProfileData : require('./Models/UserProfileData').UserProfileData,
    UserProfileId : require('./Models/UserProfileData').UserProfileId
}