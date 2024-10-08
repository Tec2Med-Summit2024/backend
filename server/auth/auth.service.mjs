import {
  createVerificationCode,
} from './auth.db.mjs';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer  from 'nodemailer';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: '',
      pass: ''
  }
});


// const pass = bcrypt.hashSync(user.password, 10);
// user.password = pass;

export const registerAcc = async (email) => {

  // TODO verificar se o mail existe nos tickets.

  const verificationCode = Math.floor(Math.random() * 90000) + 10000;
  console.log(verificationCode);

  await createVerificationCode(email, verificationCode);

  const mailOptions = {
    to: 'shitemailforshitthings@gmail.com',
    subject: '[Tec2Med] Verification Code',
    html: `<h1>Verification Code: ${verificationCode}</h1> 
    <p>Use this code to verify your account.</p>`
  };  

  await emailTransporter.sendMail(mailOptions);

  return { ok: true };
};

export const loginAcc = async (user) => {

  let userDB; 


  if (!userDB) 
    return { ok: false, error: 404, accessToken: null, errorMsg: 'User Not found.' };

  // comparing passwords
  const passwordIsValid = bcrypt.compareSync(
    user.password,
    userDB.password
  );

  if (!passwordIsValid) 
    return { ok: false, error: 401, accessToken: null, errorMsg: 'Invalid Password!' };

  const token = jwt.sign({
    id: user.id
  }, process.env.API_SECRET, {
    expiresIn: 86400
  });

  return { ok: true,
     accessToken: token, 
     message: 'Login successfull', 
     user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      }
    };
};

export const logoutAcc = async (user) => {


  return { ok: true };
};
