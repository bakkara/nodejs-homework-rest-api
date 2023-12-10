const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const path = require('path');
const fs = require('fs/promises');
const gravatar = require('gravatar');
const Jimp = require('jimp');

const sendEmail = require('../utils/helpers/sendEmail')

const User = require("../models/users");

const ctrlWrapper = require("../utils/decorators/ctrlWrapper");
const { HttpError } = require("../utils/helpers/HttpErrors");
const verifyEmailSchema = require('../const/verifyEmailSchema');


const {SECRET_KEY, BASE_URL} = process.env;
const avatarsPath = path.join(__dirname, '../', 'public', 'avatars');


const signup = ctrlWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new HttpError(409, "Email in use");
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = crypto.randomUUID()

    const newUser = await User.create({
      ...req.body, 
      password: hashPassword,
      avatarURL,
      verificationToken
    });

    const verifyEmail = verifyEmailSchema(email, BASE_URL, verificationToken)
  
  await sendEmail(verifyEmail);
    res.status(201).json({
        user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarUrl: newUser.avatarURL
    }
})
})  

const verifyEmail = ctrlWrapper(async(req, res)=> {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await User.updateOne({ verificationToken }, { verify: true, verificationToken: null });

  res.status(200).json({
    message: 'Verification successful',
  });
})

const resendEmailVerify = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(404, 'User not found'); 
  }

  if (user.verify) {
    throw new HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = verifyEmailSchema(email, BASE_URL, user.verificationToken)

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: 'Verification email sent',
  });
});

const signin = ctrlWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(401, 'Email or password is wrong')
    }
    
    if(!user.verify) {
      throw new HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw new HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

    await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });

})

const current = ctrlWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
});

const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, { token: '' });

  if (!result) {
    throw new HttpError(404, 'Not found');
  }
  res.status(204).json({});
});

const updateAvatar = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const img = await Jimp.read(oldPath);
  await img
    .resize(250, 250)
    .writeAsync(oldPath);

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
});

module.exports = {
    signup,
    verifyEmail,
    resendEmailVerify,
    signin,
    current,
    logout,
    updateAvatar
}
