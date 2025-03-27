import {
  createVerificationCode, 
  changePassword,
  lookUpAccount
} from './auth.db.mjs';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer  from 'nodemailer';
import xlsx from 'node-xlsx';

const TEST_EMAIL = '';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PWD
  }
});

export const verifyAcc = async (email) => {
  const obj = xlsx.parse("tec2med_tickeline_template.xlsx");
  const sheet = obj[0].data;  
  
  let foundUser = null;

  for (let i = 1; i < sheet.length; i++) { 
    const row = sheet[i];
    const rowEmail = row[1];

    if (rowEmail && rowEmail.trim() === email.trim()) {
      foundUser = {
        name: row[0], 
        phone: row[2] 
      };
      break;
    }
  }

  if (!foundUser) {
    return { ok: false, error: 401, errorMsg: 'Email not found in ticket list' };
  }
  
 
  const verificationCode = Math.floor(Math.random() * 90000) + 10000;
  console.log(`Verification code: ${verificationCode}`);

  await createVerificationCode(email, verificationCode, foundUser);

  email = TEST_EMAIL;
  
  const mailOptions = {
    to: email, 
    subject: '[Tec2Med] Verification Code',
    html: `<h1>Verification Code: ${verificationCode}</h1> 
    <p>Use this code to verify your account.</p>`
  };  
  
  //await emailTransporter.sendMail(mailOptions);
  
  return { ok: true, message: 'Verification code sent' };
};


export const verifyCode = async (email, code) => {

  const account = await lookUpAccount(email);

  if (!account) {
    return { ok: false, error: 404, errorMsg: 'Email not found' };
  }
  const role = account.type;
  const dbCode = account.verification_code;
  const id = account.username;
  
  if (dbCode == code) {
    console.log('Code verified');
    
    const token = jwt.sign({ email, role }, 
      process.env.TOKEN_SECRET,{
      expiresIn: '10000h',
    });

    return { ok: true, message: 'Code verified', id, token};
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


export const loginAcc = async (email, password) => {
  
  const account = await lookUpAccount(email);

  if (!account) {
    return { ok: false, error: 404, errorMsg: 'Email not found' };
  }

  const role = account.type;
  const passwordDB = account.password;
  const id = account.username;
  
  // comparing passwords
  const passwordIsValid = bcrypt.compareSync(
    password,
    passwordDB
  );

  if (!passwordIsValid) 
    return { ok: false, error: 401, errorMsg: 'Invalid Password!' };

  const token = jwt.sign({ email, role }, 
    process.env.TOKEN_SECRET,{
    expiresIn: '1000h',
  });
 
  return { ok: true, message: 'Account logged in', id, token};
};

