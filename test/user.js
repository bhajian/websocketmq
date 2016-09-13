/**
 * Created by behnamhajian on 2016-08-25.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  firstName: String,
  lastName: String,
  sex: String,
  dateOfBirth: String,
  friends: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {}
  ],
  email: String,
  emailVerified: Boolean,
  emailVerificationCode: String,
  phoneNumber: String,
  phoneVerified: Boolean,
  phoneVerificationCode: String,
  userName: String,
  password: String,
  accessToken: String,
  facebookId: String,
  facebookAccessToken: String,
  facebookSecret: String,
  googleId: String,
  googleAccessToken: String,
  googleSecret: String,
  isAdmin: Boolean,
  isOrgUser: Boolean,
  isActive: Boolean,
  dateCreated: { type: Date, default: Date.now },
  location: {},
}));
