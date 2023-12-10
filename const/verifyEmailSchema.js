

const verifyEmailSchema =(email, BASE_URL, verificationToken) => {
   return { 
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
   }
};

module.exports = verifyEmailSchema;