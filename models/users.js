const { Schema, model } = require('mongoose');
const {handleMongooseError, preUpdate} = require('../utils/helpers/handleMongooseError');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema (
{
    password: {
      type: String,
      minLength: 6,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String,
    avatarURL: {
      type: String,
      // required: true,
    },
  }, 
  
  { versionKey: false, timestamps: true })

userSchema.post('save', handleMongooseError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post('findOneAndUpdate', handleMongooseError );

const User = model('user', userSchema);


module.exports = User;