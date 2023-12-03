const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const gravatar = require('gravatar');

const User = require("../models/users");

const ctrlWrapper = require("../utils/decorators/ctrlWrapper");
const { HttpError } = require("../utils/helpers/HttpErrors");

const {SECRET_KEY} = process.env;
const avatarsPath = path.join(__dirname, '../', 'public', 'avatars');


const signup = ctrlWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body, 
      password: hashPassword,
      avatarURL
    });

    res.status(201).json({
        user: {
        email: newUser.email,
        subscription: newUser.subscription,
    }
})
})

const signin = ctrlWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong')
    }
    
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
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
    throw HttpError(404, 'Not found');
  }
  res.status(204).json({});
});

const updateAvatar = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
});

module.exports = {
    signup,
    signin,
    current,
    logout,
    updateAvatar
}
