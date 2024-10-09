import {
  createVerificationCode, 
  getVerificationCode,
  changePassword,
  lookUpAccount
} from './auth.db.mjs';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer  from 'nodemailer';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'gameherob@gmail.com',
      pass: 'zrnb qrgx hltv uvmu'
  }
});

export const registerAcc = async (email) => {

  // TODO verificar se o mail existe nos tickets.
  
  const verificationCode = Math.floor(Math.random() * 90000) + 10000;
  console.log(`Verification code: ${verificationCode}`);

  await createVerificationCode(email, verificationCode);
  
  const mailOptions = {
    to: '', // ${email}
    subject: '[Tec2Med] Verification Code',
    html: `<h1>Verification Code: ${verificationCode}</h1> 
    <p>Use this code to verify your account.</p>`
  };  

  await emailTransporter.sendMail(mailOptions);
  
  return { ok: true, message: 'Verification code sent' };
};

export const verifyCode = async (email, code) => {

  const role = await lookUpAccount(email);

  if (!role) {
    return { ok: false, error: 404, errorMsg: 'Email not found' };
  }

  const dbCode = await getVerificationCode(email);

  if (dbCode === code) {
    console.log('Code verified');
    
    const token = jwt.sign({ email, role }, 
      process.env.TOKEN_SECRET,{
      expiresIn: '1h',
    });

    return { ok: true, message: 'Code verified', token };
  }else {
    console.log('Invalid Code');
    return { ok: false, error: 403, errorMsg: 'Invalid Code' };
  }
};

export const changePass = async (email, password) => {
  if(!password) {
    return { ok: false, error: 400, errorMsg: 'Password is required!' };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await changePassword(email, hashedPassword);

  return { ok: true};
};





export const loginAcc = async (user) => {


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

