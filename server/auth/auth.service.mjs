import {
  createVerificationCode, 
  changePassword,
  lookUpAccount
} from './auth.db.mjs';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer  from 'nodemailer';
import xlsx from 'node-xlsx';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PWD
  }
});

/**
 * Send verification email with error handling and console backup
 * @param {string} email - User's email address
 * @param {string} verificationCode - Verification code to send
 * @returns {Promise<boolean>} - True if email was sent successfully or logged as backup
 */
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    to: email,
    subject: '[Tec2Med] Verification Code',
    html: `<h1>Verification Code: ${verificationCode}</h1>
    <p>Use this code to verify your account.</p>`
  };

  try {
    // Attempt to send email
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${email}`);
    return true;
  } catch (error) {
    // Log error but continue with console backup
    console.error(`❌ Failed to send email to ${email}:`, error.message);
    console.log(`📋 Console backup - Verification code for ${email}: ${verificationCode}`);
    return false; // Email failed but console backup is available
  }
};

export const verifyAcc = async (email) => {
  const obj = xlsx.parse('tec2med_tickeline_template.xlsx');
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
 
  const verificationCode = String(Math.floor(Math.random() * 90000) + 10000);
  console.log(`🔐 Generated verification code: ${verificationCode} (type: ${typeof verificationCode})`);

  await createVerificationCode(email, verificationCode, foundUser);

  // Send email with console backup
  const emailSent = await sendVerificationEmail(email, verificationCode);
  
  return {
    ok: true,
    message: emailSent ? 'Verification code sent via email' : 'Verification code sent (console backup available)',
    emailSent
  };
};


export const verifyCode = async (email, code) => {

  const account = await lookUpAccount(email);

  if (!account) {
    return { ok: false, error: 404, errorMsg: 'Email not found' };
  }
  const role = account.type;
  const dbCode = account.verification_code;
  const id = account.username;
  
  // Debug logging to identify data type issues
  console.log('🔍 Verification Debug:');
  console.log(`   Email: ${email}`);
  console.log(`   Input code: ${code} (type: ${typeof code})`);
  console.log(`   DB code: ${dbCode} (type: ${typeof dbCode})`);
  console.log(`   Strict equality (===): ${dbCode === code}`);
  console.log(`   Loose equality (==): ${String(dbCode) === String(code)}`);
  
  // Try both string and number comparison
  const inputCodeNum = Number(code);
  const dbCodeNum = Number(dbCode);
  
  console.log(`   Input as number: ${inputCodeNum} (type: ${typeof inputCodeNum})`);
  console.log(`   DB as number: ${dbCodeNum} (type: ${typeof dbCodeNum})`);
  console.log(`   Number equality: ${dbCodeNum === inputCodeNum}`);
  
  // Check if codes match in any format
  if (dbCode === code || String(dbCode) === String(code) || dbCodeNum === inputCodeNum) {
    console.log('✅ Code verified');
    
    const token = jwt.sign({ email, role },
      process.env.TOKEN_SECRET,{
      expiresIn: '10000h',
    });

    return { ok: true, message: 'Code verified', id, token};
  } else {
    console.log('❌ Invalid Code');
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
  const name = account.name;
  const phone = account.phone;

  if (!passwordDB) {
    return { ok: false, error: 401, errorMsg: 'Password not set' };
  }
  
  // comparing passwords
  const passwordIsValid = bcrypt.compareSync(
    password,
    passwordDB
  );

  if (!passwordIsValid) 
    return { ok: false, error: 401, errorMsg: 'Invalid Password!' };

  const token = jwt.sign({ email, role, name, phone, id }, 
    process.env.TOKEN_SECRET,{
    expiresIn: '1000h',
  });

  return { ok: true, message: 'Account logged in', id, token};
};

